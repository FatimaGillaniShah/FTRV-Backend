import express from 'express';
import moment from 'moment';
import { BadRequestError, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import { createPollSchema, updatePollSchema } from './validationSchema';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { getPollByIdQuery, listPolls, updateQuery } from './query';

const { Poll, PollOption } = models;

class PollController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createPoll);
    this.router.get('/:id/:date?', this.getPollById);
    this.router.put('/', this.updatePoll);
    this.router.get('/', this.list);

    return this.router;
  }

  static appendStateFlags(polls, date) {
    return polls.map((poll) => {
      const pollData = poll.toJSON();
      const pollExpired = moment(date).isAfter(moment(pollData.endDate), 'day');
      const pollPending = moment(date).isBefore(moment(pollData.startDate), 'day');
      pollData.expired = pollExpired;
      pollData.pending = pollPending;
      PollController.appendVotedFlag(pollData.options);
      return pollData;
    });
  }

  static appendVotedFlag(options) {
    return options.map((option) => {
      const pollData = option;
      pollData.voted = pollData.voted.length > 0;
      return pollData;
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
      },
    } = req;
    const query = listPolls({
      sortOrder,
      sortColumn,
      pageNumber,
      pageSize,
      searchString,
      name,
      status,
    });
    const polls = await Poll.findAndCountAll(query);
    const { rows, count } = polls;
    const updatedRows = PollController.appendStateFlags(rows, date);
    const pollResponse = { count, rows: updatedRows };

    return SuccessResponse(res, pollResponse);
  }

  @Request
  @RequestBodyValidator(createPollSchema)
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

  @Request
  @RequestBodyValidator(updatePollSchema)
  static async updatePoll(req, res) {
    const {
      body: pollPayload,
      query: { id: pollId },
      user,
    } = req;
    const { options: pollOptions, ...pollInfo } = pollPayload;
    const query = updateQuery(pollId);
    const pollExist = await Poll.findOne(query);
    if (pollExist) {
      pollInfo.updatedBy = user.id;
      const poll = await Poll.update(pollInfo, query);
      const pollOptionPromises = PollController.updatePollOption(pollId, pollOptions);
      await Promise.all(pollOptionPromises);
      return SuccessResponse(res, poll);
    }
    BadRequestError(`Poll does not exist`, STATUS_CODES.NOTFOUND);
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
