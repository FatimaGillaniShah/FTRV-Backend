import express from 'express';
import Joi from 'joi';
import { STATUS_CODES } from '../../utils/constants';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { createRingGroupSchema } from './validationSchema';
import models from '../../models';

const { RingGroup } = models;

class RingGroupController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createRingGroup);

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
}
export default RingGroupController;
