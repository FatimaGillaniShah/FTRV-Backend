import express from 'express';
import moment from 'moment';
import { BadRequestError, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import { savePollResultSchema } from './validationSchema';
import { STATUS_CODES } from '../../utils/constants';
import { pollExistQuery, pollOptionQuery, votedQuery } from './query';

const { Poll, PollOption, UserPollVote } = models;

class VoteController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.savePollResult);

    return this.router;
  }

  @RequestBodyValidator(savePollResultSchema)
  @Request
  static async savePollResult(req, res) {
    const {
      body: userVotePayload,
      body: { pollId, pollOptionId },
      query: { date = new Date() },
      user,
    } = req;

    const pollExist = await Poll.findOne(pollExistQuery(pollId));
    if (!pollExist) {
      BadRequestError(`Poll does not exist`, STATUS_CODES.INVALID_INPUT);
    }
    const expired = moment(date).isAfter(moment(pollExist.endDate), 'day');
    const pending = moment(date).isBefore(moment(pollExist.startDate), 'day');
    if (expired) {
      BadRequestError(`You can't vote on expired poll`, STATUS_CODES.INVALID_INPUT);
    }
    if (pending) {
      BadRequestError(`Voting is not started yet`, STATUS_CODES.INVALID_INPUT);
    }
    const userVoted = await UserPollVote.findOne(votedQuery({ userId: user.id, pollId }));
    if (userVoted) {
      BadRequestError(`You have already voted on this poll`, STATUS_CODES.INVALID_INPUT);
    }
    const votes = await PollOption.max('votes', pollOptionQuery(pollOptionId));
    const updateParams = {
      votes: votes ? votes + 1 : 1,
    };
    await PollOption.update(updateParams, pollOptionQuery(pollOptionId));
    userVotePayload.userId = user.id;
    const userPollVote = await UserPollVote.create(userVotePayload);
    return SuccessResponse(res, userPollVote);
  }
}
export default VoteController;
