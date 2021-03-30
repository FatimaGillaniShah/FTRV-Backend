import Joi from 'joi';
import express from 'express';
import models from '../../models';

import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { eventCreateSchema } from './validationSchemas';

const { Event } = models;
class EventsController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createEvent);
    return this.router;
  }

  static async createEvent(req, res, next) {
    const { body: eventPayload } = req;
    try {
      const result = Joi.validate(eventPayload, eventCreateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), 422);
      }
      console.log(eventPayload);

      const event = await Event.create(eventPayload);
      const eventResponse = event.toJSON();
      return SuccessResponse(res, eventResponse);
    } catch (e) {
      next(e);
    }
  }
}

export default EventsController;
