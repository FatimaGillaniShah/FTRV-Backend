import express from 'express';
import Joi from 'joi';
import { STATUS_CODES } from '../../utils/constants';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { createJobApplicantSchema } from './validationSchema';
import uploadFile from '../../middlewares/upload';

const { JobApplicant, Job } = models;

class JobApplicantController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', uploadFile('document').single('file'), this.createJobApplicant);

    return this.router;
  }

  static async createJobApplicant(req, res, next) {
    const { body: jobApplicantPayload, user, file = {} } = req;
    try {
      const { jobId } = jobApplicantPayload;
      const result = Joi.validate(jobApplicantPayload, createJobApplicantSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      if (!file.key) {
        BadRequestError(`Please attach resume`, STATUS_CODES.INVALID_INPUT);
      }
      const hasAppliedQuery = {
        where: {
          jobId,
          userId: user.id,
        },
      };
      const hasApplied = JobApplicant.findAll(hasAppliedQuery);
      if (hasApplied.length <= 0) {
        BadRequestError(`You have already applied to this job`, STATUS_CODES.INVALID_INPUT);
      }
      const jobExistQuery = {
        where: {
          id: jobId,
        },
      };
      const jobExist = Job.findOne(jobExistQuery);
      if (new Date(jobExist.expiryDate).getTime() < new Date().getTime()) {
        BadRequestError(`Job has been expired`, STATUS_CODES.INVALID_INPUT);
      }

      jobApplicantPayload.userId = user.id;
      jobApplicantPayload.jobId = jobId;
      jobApplicantPayload.resume = file.key;
      const jobApplicant = await JobApplicant.create(jobApplicantPayload);
      return SuccessResponse(res, jobApplicant);
    } catch (e) {
      next(e);
    }
  }
}
export default JobApplicantController;
