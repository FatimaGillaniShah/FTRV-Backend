import Joi from 'joi';
import express from 'express';
import models from '../../models';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { listQuery } from './query';
import { STATUS_CODES } from '../../utils/constants';
import { locationCreateSchema, locationUpdateSchema } from './validationSchemas';

const { Location } = models;
class LocationController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createLocation);
    this.router.put('/:id', this.updateLocation);
    this.router.delete('/deleteLocations', this.deleteLocations);

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

  static async updateLocation(req, res, next) {
    const {
      body: locationPayload,
      params: { id: locationId },
    } = req;
    try {
      const result = Joi.validate(locationPayload, locationUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: locationId,
        },
      };

      const locationtExists = await Location.findOne(query);
      if (locationtExists) {
        const location = await Location.update(locationPayload, query);
        return SuccessResponse(res, location);
      }
      BadRequestError(`Location does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }

  static async deleteLocations(req, res, next) {
    const {
      body: { ids = [] },
    } = req;
    try {
      if (ids.length < 1) {
        BadRequestError(`Location ids required`, STATUS_CODES.INVALID_INPUT);
      }
      const locations = await Location.destroy({
        where: {
          id: ids,
        },
        force: true,
      });
      return SuccessResponse(res, { count: locations });
    } catch (e) {
      next(e);
    }
  }
}

export default LocationController;
