import express from 'express';
import Joi from 'joi';
import { STATUS_CODES } from '../../utils/constants';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { createJobSchema } from './validationSchema';

const { Job } = models;

class JobController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createJob);

    return this.router;
  }

  static async createJob(req, res, next) {
    const { body: jobPayload, user } = req;
    try {
      const result = Joi.validate(jobPayload, createJobSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      jobPayload.userId = user.id;
      const job = await Job.create(jobPayload);
      return SuccessResponse(res, job);
    } catch (e) {
      next(e);
    }
  }
}
export default JobController;
