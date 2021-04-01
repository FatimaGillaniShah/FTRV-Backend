import Joi from 'joi';
import express from 'express';
import models from '../../models';

import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { eventCreateSchema } from './validationSchemas';
import { listQuery } from './query';

const { Event } = models;
class EventsController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createEvent);
    this.router.get('/', this.list);

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
      const events = await Event.findAll(query);
      return SuccessResponse(res, events);
    } catch (e) {
      next(e);
    }
  }

  static async createEvent(req, res, next) {
    const { body: eventPayload } = req;
    try {
      const result = Joi.validate(eventPayload, eventCreateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), 422);
      }

      const event = await Event.create(eventPayload);
      const eventResponse = event.toJSON();
      return SuccessResponse(res, eventResponse);
    } catch (e) {
      next(e);
    }
  }
}

export default EventsController;
