import express from 'express';
import { SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import { createPollSchema } from './validationSchema';

const { Poll, PollOption } = models;

class PollController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createPoll);

    return this.router;
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
