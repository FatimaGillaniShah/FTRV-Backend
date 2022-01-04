import express from 'express';
import moment from 'moment';
import _ from 'lodash';
import { BadRequestError, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import { createPollSchema, updatePollSchema } from './validationSchema';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { getPollByIdQuery, listPolls, updateQuery, votedQuery } from './query';

const { Poll, PollOption, UserPollVote } = models;

class PollController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createPoll);
    this.router.get('/:id/:date?', this.getPollById);
    this.router.put('/', this.updatePoll);
    this.router.get('/', this.list);
    this.router.delete('/', this.deletePoll);

    return this.router;
  }

  static appendStateFlags(polls, date) {
    return polls.map((poll) => {
      const pollData = poll.toJSON();
      const pollExpired = moment(date).isAfter(moment(pollData.endDate), 'day');
      const pollPending = moment(date).isBefore(moment(pollData.startDate), 'day');
      pollData.expired = pollExpired;
      pollData.pending = pollPending;
      return pollData;
    });
  }

  static async appendUserVotedFlag(polls, userId) {
    const pollId = _.map(polls, 'id');
    const userPollVotes = await UserPollVote.findAll(votedQuery({ userId, pollId }));
    return polls.map((poll) => {
      // eslint-disable-next-line no-param-reassign
      poll.voted = !!_.find(userPollVotes, { pollId: poll.id });
      poll.options.map((option) => {
        // eslint-disable-next-line no-param-reassign
        option.voted = !!_.find(userPollVotes, { pollOptionId: option.id });
        return option;
      });
      return poll;
    });
  }

  @Request
  static async list(req, res) {
    const {
      query: {
        sortOrder,
        sortColumn,
        pageNumber = 1,
        pageSize = PAGE_SIZE,
        date = new Date(),
        searchString,
        name,
        status,
        isPagination,
      },
      user: { id: userId },
    } = req;
    const pollStates = ['pending', 'expired'];
    const isPollState = pollStates.includes(status);
    const query = listPolls({
      sortOrder,
      sortColumn,
      pageNumber,
      pageSize,
      searchString,
      name,
      status,
      isPagination,
    });
    const polls = await Poll.findAndCountAll(query);
    let { count } = polls;
    let updatedRows = PollController.appendStateFlags(polls.rows, date);
    updatedRows = await PollController.appendUserVotedFlag(updatedRows, userId);
    if (isPollState) {
      updatedRows = updatedRows.filter((poll) => poll[status]);
      count = updatedRows.length;
    } else if (!isPollState && status) {
      updatedRows = updatedRows.filter((poll) => !poll.expired && !poll.pending);
      count = updatedRows.length;
    }
    const pollResponse = { count, rows: updatedRows };

    return SuccessResponse(res, pollResponse);
  }

  @RequestBodyValidator(createPollSchema)
  @Request
  static async createPoll(req, res) {
    const { body: pollPayload, user } = req;
    const { options: pollOptions, ...pollInfo } = pollPayload;
    pollInfo.createdBy = user.id;
    const poll = await Poll.create(pollInfo);
    const pollResponse = poll.toJSON();
    const pollOptionPromises = PollController.createPollOption(poll.id, pollOptions);
    await Promise.all(pollOptionPromises);
    return SuccessResponse(res, pollResponse);
  }

  @Request
  static async getPollById(req, res) {
    const {
      params: { id: pollId, date = new Date() },
    } = req;
    if (!pollId) {
      BadRequestError(`Poll id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const query = getPollByIdQuery(pollId);
    const poll = await Poll.findOne(query);
    if (poll) {
      const pollResponse = PollController.appendStateFlags([poll], date);
      return SuccessResponse(res, pollResponse);
    }
    return BadRequestError(`Poll does not exist`, STATUS_CODES.NOTFOUND);
  }

  @RequestBodyValidator(updatePollSchema)
  @Request
  static async updatePoll(req, res) {
    const {
      body: pollPayload,
      query: { id: pollId, date = new Date() },
      user,
    } = req;
    const { options: pollOptions, ...pollInfo } = pollPayload;
    const query = getPollByIdQuery(pollId);
    const pollExist = await Poll.findOne(query);
    const pollResponse = PollController.appendStateFlags([pollExist], date);
    const pollContainVotes = pollResponse[0].options.filter((option) => option.votes);
    if (pollContainVotes.length > 0) {
      BadRequestError(`You cannot edit poll that contain votes`, STATUS_CODES.NOTFOUND);
    }
    if (pollResponse.expired) {
      BadRequestError(`You cannot edit expired poll`, STATUS_CODES.NOTFOUND);
    }
    if (pollResponse.pending) {
      BadRequestError(`You cannot edit pending poll`, STATUS_CODES.NOTFOUND);
    }
    if (pollExist) {
      pollInfo.updatedBy = user.id;
      const poll = await Poll.update(pollInfo, query);
      const pollOptionPromises = PollController.updatePollOption(pollId, pollOptions);
      await Promise.all(pollOptionPromises);
      return SuccessResponse(res, poll);
    }
    BadRequestError(`Poll does not exist`, STATUS_CODES.NOTFOUND);
  }

  @Request
  static async deletePoll(req, res) {
    const {
      body: { ids: pollIds = [] },
    } = req;

    if (pollIds.length < 1) {
      BadRequestError(`Poll id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const query = {
      where: {
        id: pollIds,
      },
    };
    const pollCount = await Poll.destroy(query);
    return SuccessResponse(res, { count: pollCount });
  }

  static createPollOption(pollId, pollOptions) {
    return pollOptions.map((polOption) => {
      const createPollParams = {
        pollId,
        name: polOption,
      };
      return PollOption.create(createPollParams);
    });
  }

  static updatePollOption(pollId, pollOptions) {
    return pollOptions.map((pollOption) => {
      if (typeof pollOption === 'string') {
        return PollController.createPollOption(pollId, [pollOption]);
      }
      const query = updateQuery(pollOption.id);
      const updatePollParams = {
        name: pollOption.name,
      };
      return PollOption.update(updatePollParams, query);
    });
  }
}
export default PollController;
