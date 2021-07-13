import express from 'express';
import Joi from 'joi';
import { STATUS_CODES } from '../../utils/constants';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { createRingGroupSchema, updateRingGroupSchema } from './validationSchema';
import models from '../../models';
import { getRingGroupByIdQuery } from './query';

const { RingGroup } = models;

class RingGroupController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createRingGroup);
    this.router.get('/:id', this.getRingGroupById);
    this.router.put('/:id', this.updateRingGroup);

    return this.router;
  }

  static async createRingGroup(req, res, next) {
    const { body: ringGroupPayload } = req;
    try {
      const result = Joi.validate(ringGroupPayload, createRingGroupSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const ringGroup = await RingGroup.create(ringGroupPayload);
      return SuccessResponse(res, ringGroup);
    } catch (e) {
      next(e);
    }
  }

  static async getRingGroupById(req, res, next) {
    const {
      params: { id: ringGroupId },
    } = req;
    try {
      if (!ringGroupId) {
        BadRequestError(`Ring group id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const query = getRingGroupByIdQuery(ringGroupId);
      const ringGroup = await RingGroup.findOne(query);
      return SuccessResponse(res, ringGroup);
    } catch (e) {
      next(e);
    }
  }

  static async updateRingGroup(req, res, next) {
    const {
      body: ringGroupPayload,
      params: { id: ringGroupId },
    } = req;
    try {
      const result = Joi.validate(ringGroupPayload, updateRingGroupSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const updateQuery = {
        where: {
          id: ringGroupId,
        },
      };

      const ringGroupExist = await RingGroup.findOne(updateQuery);
      if (ringGroupExist) {
        const ringGroup = await RingGroup.update(ringGroupPayload, updateQuery);
        return SuccessResponse(res, ringGroup);
      }
      BadRequestError(`Ring Group does not exist`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }
}
export default RingGroupController;
