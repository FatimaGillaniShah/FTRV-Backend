import express from 'express';
import moment from 'moment';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { BadRequestError, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { createJobSchema, updateJobSchema } from './validationSchema';
import { getJobByIdQuery, listJobs } from './query';
import { Request, RequestBodyValidator } from '../../utils/decorators';

const { Job, JobApplicant } = models;

class JobController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createJob);
    this.router.get('/:id', this.getJobById);
    this.router.put('/:id', this.updateJob);
    this.router.delete('/', this.deleteJob);

    return this.router;
  }

  static appendExpiredFlag(jobs) {
    return jobs.map((job) => {
      const jobData = job.toJSON();
      const jobExpired = moment(jobData.expiryDate) < moment();
      jobData.expired = jobExpired;
      return jobData;
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
        searchString,
        title,
        departmentId,
        locationId,
      },
    } = req;
    const query = listJobs({
      sortOrder,
      sortColumn,
      pageNumber,
      pageSize,
      searchString,
      title,
      departmentId,
      locationId,
    });
    const jobs = await Job.findAndCountAll(query);
    const { rows, count } = jobs;
    const updatedRows = JobController.appendExpiredFlag(rows);
    const jobResponse = { count, rows: updatedRows };

    return SuccessResponse(res, jobResponse);
  }

  @Request
  @RequestBodyValidator(createJobSchema)
  static async createJob(req, res) {
    const { body: jobPayload, user } = req;
    jobPayload.createdBy = user.id;
    const job = await Job.create(jobPayload);
    return SuccessResponse(res, job);
  }

  @Request
  static async getJobById(req, res) {
    const {
      params: { id: jobId },
      user,
    } = req;
    if (!jobId) {
      BadRequestError(`Job id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const appliedQuery = {
      where: {
        jobId,
        userId: user.id,
      },
    };
    const query = getJobByIdQuery(jobId);
    const job = await Job.findOne(query);
    if (job) {
      const jobResponse = JobController.appendExpiredFlag([job]);
      const hasApplied = await JobApplicant.findOne(appliedQuery);
      jobResponse[0].applied = !!hasApplied;
      return SuccessResponse(res, jobResponse);
    }
    return BadRequestError(`Job does not exist`, STATUS_CODES.NOTFOUND);
  }

  @Request
  @RequestBodyValidator(updateJobSchema)
  static async updateJob(req, res) {
    const {
      body: jobPayload,
      params: { id: jobId },
      user,
    } = req;
    const updateQuery = {
      where: {
        id: jobId,
      },
    };

    const jobExist = await Job.findOne(updateQuery);
    if (jobExist) {
      jobPayload.updatedBy = user.id;
      const job = await Job.update(jobPayload, updateQuery);
      return SuccessResponse(res, job);
    }
    BadRequestError(`Job does not exist`, STATUS_CODES.NOTFOUND);
  }

  @Request
  static async deleteJob(req, res) {
    const {
      body: { ids: jobIds = [] },
    } = req;

    if (jobIds.length < 1) {
      BadRequestError(`Job id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const query = {
      where: {
        id: jobIds,
      },
    };
    const jobCount = await Job.destroy(query);
    return SuccessResponse(res, { count: jobCount });
  }
}
export default JobController;