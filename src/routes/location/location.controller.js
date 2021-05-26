import Joi from 'joi';
import express from 'express';
import models from '../../models';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { listQuery } from './query';
import { STATUS_CODES } from '../../utils/constants';
import { locationCreateSchema } from './validationSchemas';

const { Location } = models;
class LocationController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createLocation);

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
      const locations = await Location.findAndCountAll(query);
      return SuccessResponse(res, locations);
    } catch (e) {
      next(e);
    }
  }

  static async createLocation(req, res, next) {
    const { body: locationPayload } = req;
    try {
      const result = Joi.validate(locationPayload, locationCreateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }

      const location = await Location.create(locationPayload);
      const locationResponse = location.toJSON();
      return SuccessResponse(res, locationResponse);
    } catch (e) {
      next(e);
    }
  }
}

export default LocationController;
