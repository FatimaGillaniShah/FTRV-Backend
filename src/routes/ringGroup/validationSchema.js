import Joi from 'joi';

export const createRingGroupSchema = Joi.object().keys({
  name: Joi.string().required(),
  extension: Joi.string().required(),
  locationId: Joi.number().required(),
  departmentId: Joi.number().required(),
});

export const updateRingGroupSchema = Joi.object().keys({
  name: Joi.string().optional(),
  extension: Joi.string().optional(),
  locationId: Joi.number().optional(),
  departmentId: Joi.number().optional(),
});
