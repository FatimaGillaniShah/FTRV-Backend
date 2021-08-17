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
    const { pollOptions, ...pollInfo } = pollPayload;
    pollPayload.createdBy = user.id;
    const poll = await Poll.create(pollInfo);
    await PollOption.create(pollOptions);
    return SuccessResponse(res, poll);
  }
}
export default PollController;
