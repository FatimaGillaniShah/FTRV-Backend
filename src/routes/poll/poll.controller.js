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

    return this.router;
  }

  static appendExpiredFlag(jobs) {
    return jobs.map((job) => {
      const jobData = job.toJSON();
      const jobExpired = moment().isAfter(moment(jobData.expiryDate), 'day');
      jobData.expired = jobExpired;
      return jobData;
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
      params: { id: pollId },
      // user,
    } = req;
    if (!pollId) {
      BadRequestError(`Poll id is required`, STATUS_CODES.INVALID_INPUT);
    }
    // const appliedQuery = {
    //   where: {
    //     pollId,
    //     userId: user.id,
    //   },
    // };
    const query = getPollByIdQuery(pollId);
    const poll = await Poll.findOne(query);
    if (poll) {
      const pollResponse = PollController.appendExpiredFlag([poll]);
      // const hasApplied = await JobApplicant.findOne(appliedQuery);
      // pollResponse[0].applied = !!hasApplied;
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
