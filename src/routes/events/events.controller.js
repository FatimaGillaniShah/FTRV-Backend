import Joi from 'joi';
import express from 'express';
import { omit, pick } from 'lodash';
import models from '../../models';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { eventCreateSchema, eventUpdateSchema } from './validationSchemas';
import { listQuery } from './query';
import { ROLES, STATUS_CODES } from '../../utils/constants';

const { Event, EventLocation, Location, User } = models;
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
      user,
      query: { sortColumn, sortOrder, pageNumber = 1, pageSize },
    } = req;
    const { id, role } = user;
    try {
      let events;
      const query = listQuery({
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
        role,
        id,
      });
      if (role === ROLES.ADMIN) {
        events = await Event.findAndCountAll();
      } else if (role === ROLES.USER) {
        const UserObj = await User.findOne(query);
        const data = pick(UserObj.location, ['eventIds']);
        events = { rows: data.eventIds };
      }
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
      const event = await Event.create(omit(eventPayload, ['locationIds']));
      const eventResponse = event.toJSON();
      const eventLocationPromises = EventsController.getEventLocationData(
        eventResponse.id,
        eventPayload.locationIds
      );
      await Promise.all(eventLocationPromises);
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
        include: {
          model: Location,
          as: 'locationIds',
          attributes: ['id', 'name'],
          through: { attributes: [] },
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
        const event = await Event.update(omit(eventPayload, ['locationIds']), query);
        await EventLocation.destroy({
          where: {
            eventId,
          },
        });
        const eventLocationPromises = EventsController.getEventLocationData(
          eventId,
          eventPayload.locationIds
        );
        await Promise.all(eventLocationPromises);
        return SuccessResponse(res, event);
      }
      BadRequestError(`Event does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }

  static getEventLocationData(eventId, locationIds) {
    return locationIds.map((locationId) => {
      const eventLocationCreateParams = {
        eventId,
        locationId,
      };
      return EventLocation.create(eventLocationCreateParams);
    });
  }
}

export default EventsController;
