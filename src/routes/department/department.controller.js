import Joi from 'joi';
import express from 'express';
import models from '../../models';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { listQuery } from './query';
import { departmentSchema } from './validationSchemas';
import { STATUS_CODES } from '../../utils/constants';

const { Department, User } = models;
class DepartmentController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createDepartment);
    this.router.get('/', this.list);
    this.router.delete('/', this.deleteDepartment);
    this.router.get('/:id', this.getDepartmentById);
    this.router.put('/:id', this.updateDepartment);

    return this.router;
  }

  static async list(req, res, next) {
    const {
      query: { sortColumn, sortOrder, pageNumber = 1, pageSize },
    } = req;
    try {
      const query = listQuery({
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
      });
      const departments = await Department.findAndCountAll(query);
      return SuccessResponse(res, departments);
    } catch (e) {
      next(e);
    }
  }

  static async createDepartment(req, res, next) {
    const { body: departmentPayload } = req;
    try {
      const result = Joi.validate(departmentPayload, departmentSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }

      const department = await Department.create(departmentPayload);
      const departmentResponse = department.toJSON();
      return SuccessResponse(res, departmentResponse);
    } catch (e) {
      next(e);
    }
  }

  static async deleteDepartment(req, res, next) {
    const {
      body: { ids = [] },
    } = req;
    try {
      if (ids.length < 1) {
        BadRequestError(`Department ids required`, STATUS_CODES.INVALID_INPUT);
      }
      const department = await Department.destroy({
        where: {
          id: ids,
        },
      });
      if (department === 0) {
        BadRequestError(`Department doesn't exist`, STATUS_CODES.INVALID_INPUT);
      }
      const query = { where: { departmentId: ids } };
      const usersExist = await User.count(query);
      if (usersExist) {
        const userUpdateParams = { departmentId: null };
        await User.update(userUpdateParams, query);
      }
      return SuccessResponse(res, department);
    } catch (e) {
      next(e);
    }
  }

  static async getDepartmentById(req, res, next) {
    const {
      params: { id },
    } = req;

    try {
      if (!id) {
        BadRequestError(`Department id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const department = await Department.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      return SuccessResponse(res, department);
    } catch (e) {
      next(e);
    }
  }

  static async updateDepartment(req, res, next) {
    const {
      body: departmentPayload,
      params: { id: departmentId },
    } = req;
    try {
      const result = Joi.validate(departmentPayload, departmentSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: departmentId,
        },
      };

      const departmentExist = await Department.findOne(query);
      if (departmentExist) {
        const department = await Department.update(departmentPayload, query);
        return SuccessResponse(res, department);
      }
      BadRequestError(`Department does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }
}

export default DepartmentController;
