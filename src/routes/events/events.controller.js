import Joi from 'joi';
import express from 'express';
import models from '../../models';

import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { eventCreateSchema, eventUpdateSchema } from './validationSchemas';
import { listQuery } from './query';
import { STATUS_CODES } from '../../utils/constants';

const { Event } = models;
class EventsController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createEvent);
    this.router.get('/', this.list);
    this.router.delete('/', this.deleteEvents);
    this.router.get('/:id', this.getEventById);
    this.router.put('/:id', this.updateEvent);

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
      const events = await Event.findAndCountAll(query);
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
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }

      const event = await Event.create(eventPayload);
      const eventResponse = event.toJSON();
      return SuccessResponse(res, eventResponse);
    } catch (e) {
      next(e);
    }
  }

  static async deleteEvents(req, res, next) {
    const {
      body: { ids = [] },
    } = req;
    try {
      if (ids.length < 1) {
        BadRequestError(`Event ids required`, STATUS_CODES.INVALID_INPUT);
      }
      const events = await Event.destroy({
        where: {
          id: ids,
        },
      });
      return SuccessResponse(res, { count: events });
    } catch (e) {
      next(e);
    }
  }

  static async getEventById(req, res, next) {
    const {
      params: { id },
    } = req;

    try {
      if (!id) {
        BadRequestError(`Event id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const event = await Event.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
      });
      return SuccessResponse(res, event);
    } catch (e) {
      next(e);
    }
  }

  static async updateEvent(req, res, next) {
    const {
      body: eventPayload,
      params: { id: eventId },
    } = req;
    try {
      const result = Joi.validate(eventPayload, eventUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: eventId,
        },
      };

      const eventExists = await Event.findOne(query);
      if (eventExists) {
        const event = await Event.update(eventPayload, query);
        return SuccessResponse(res, event);
      }
      BadRequestError(`Event does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }
}

export default EventsController;
