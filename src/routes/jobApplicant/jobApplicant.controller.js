import express from 'express';
import moment from 'moment';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import {
  BadRequestError,
  generatePreSignedUrlForGetObject,
  SuccessResponse,
} from '../../utils/helper';
import models from '../../models';
import { createJobApplicantSchema } from './validationSchema';
import uploadFile from '../../middlewares/upload';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import { listQuery } from './query';

const { JobApplicant, Job } = models;

class JobApplicantController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', uploadFile('document').single('file'), this.createJobApplicant);
    this.router.get('/', this.list);

    return this.router;
  }

  static generatePreSignedUrl(applicants) {
    applicants.forEach((applicant) => {
      if (applicant.resume) {
        // eslint-disable-next-line no-param-reassign
        applicant.resume = generatePreSignedUrlForGetObject(applicant.resume);
      }
    });
  }

  @RequestBodyValidator(createJobApplicantSchema)
  @Request
  static async createJobApplicant(req, res) {
    const { body: jobApplicantPayload, user, file = {} } = req;
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
    const jobExpired = moment().isAfter(moment(jobExist.expiryDate), 'day');
    if (jobExpired) {
      BadRequestError(`Job has been expired`, STATUS_CODES.INVALID_INPUT);
    }

    jobApplicantPayload.userId = user.id;
    jobApplicantPayload.jobId = jobId;
    jobApplicantPayload.resume = file.key;
    const jobApplicant = await JobApplicant.create(jobApplicantPayload);
    return SuccessResponse(res, jobApplicant);
  }

  @Request
  static async list(req, res, next) {
    const {
      query: { jobId, sortOrder, sortColumn, pageNumber = 1, pageSize = PAGE_SIZE, isPagination },
    } = req;
    try {
      if (pageNumber <= 0) {
        BadRequestError('Invalid page number', STATUS_CODES.INVALID_INPUT);
      }
      if (!jobId) {
        BadRequestError('Job Required', STATUS_CODES.INVALID_INPUT);
      }
      const query = listQuery({
        jobId,
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
        isPagination,
      });
      const applicants = await JobApplicant.findAndCountAll(query);
      JobApplicantController.generatePreSignedUrl(applicants.rows);
      return SuccessResponse(res, applicants);
    } catch (e) {
      next(e);
    }
  }
}
export default JobApplicantController;
