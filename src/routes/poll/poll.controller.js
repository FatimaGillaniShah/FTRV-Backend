import express from 'express';
import moment from 'moment';
import { BadRequestError, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import { createPollSchema } from './validationSchema';
import { STATUS_CODES } from '../../utils/constants';
import { getPollByIdQuery } from './query';

const { Poll, PollOption } = models;

class PollController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createPoll);
    this.router.get('/:id', this.getPollById);

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
      query: { id: pollId, date = new Date() },
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

  static createPollOption(pollId, pollOptions) {
    return pollOptions.map((polOption) => {
      const eventLocationCreateParams = {
        pollId,
        name: polOption,
      };
      return PollOption.create(eventLocationCreateParams);
    });
  }
}
export default PollController;
