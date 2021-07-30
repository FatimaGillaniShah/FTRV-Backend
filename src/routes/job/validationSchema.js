import Joi from 'joi';

export const createJobSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  locationId: Joi.number().required(),
  departmentId: Joi.number().required(),
  expiryDate: Joi.date().required(),
});

export const updateJobSchema = Joi.object().keys({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  locationId: Joi.number().optional(),
  departmentId: Joi.number().optional(),
  expiryDate: Joi.date().optional(),
});
