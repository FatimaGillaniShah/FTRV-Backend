import express from 'express';
import Joi from 'joi';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { createJobSchema, updateJobSchema } from './validationSchema';
import { getJobByIdQuery, listJobs } from './query';

const { Job } = models;

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

  static async list(req, res, next) {
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
    try {
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
      return SuccessResponse(res, jobs);
    } catch (e) {
      next(e);
    }
  }

  static async createJob(req, res, next) {
    const { body: jobPayload, user } = req;
    try {
      const result = Joi.validate(jobPayload, createJobSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      jobPayload.createdBy = user.id;
      const job = await Job.create(jobPayload);
      return SuccessResponse(res, job);
    } catch (e) {
      next(e);
    }
  }

  static async getJobById(req, res, next) {
    const {
      params: { id: jobId },
    } = req;
    try {
      if (!jobId) {
        BadRequestError(`Job id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const query = getJobByIdQuery(jobId);
      const job = await Job.findOne(query);
      return SuccessResponse(res, job);
    } catch (e) {
      next(e);
    }
  }

  static async updateJob(req, res, next) {
    const {
      body: jobPayload,
      params: { id: jobId },
      user,
    } = req;
    try {
      const result = Joi.validate(jobPayload, updateJobSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
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
    } catch (e) {
      next(e);
    }
  }

  static async deleteJob(req, res, next) {
    const {
      body: { ids: jobIds = [] },
    } = req;

    try {
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
    } catch (e) {
      next(e);
    }
  }
}
export default JobController;
