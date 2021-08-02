import express from 'express';
import { STATUS_CODES } from '../../utils/constants';
import { BadRequestError, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { createJobApplicantSchema } from './validationSchema';
import uploadFile from '../../middlewares/upload';
import { Request, RequestBodyValidator } from '../../utils/decorators';

const { JobApplicant, Job } = models;

class JobApplicantController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', uploadFile('document').single('file'), this.createJobApplicant);

    return this.router;
  }

  @RequestBodyValidator(createJobApplicantSchema)
  @Request
  static async createJobApplicant(req, res, next) {
    const { body: jobApplicantPayload, user, file = {} } = req;
    try {
      const { jobId } = jobApplicantPayload;
      if (!file.key) {
        BadRequestError(`Please attach resume`, STATUS_CODES.INVALID_INPUT);
      }
      const hasAppliedQuery = {
        where: {
          jobId,
          userId: user.id,
        },
      };
      const hasApplied = await JobApplicant.findAll(hasAppliedQuery);
      if (hasApplied.length >= 1) {
        BadRequestError(`You have already applied to this job`, STATUS_CODES.INVALID_INPUT);
      }
      const jobExistQuery = {
        where: {
          id: jobId,
        },
      };
      const jobExist = await Job.findOne(jobExistQuery);
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
