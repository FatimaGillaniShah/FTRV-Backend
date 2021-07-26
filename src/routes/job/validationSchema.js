import Joi from 'joi';

export const createJobSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  locationId: Joi.number().required(),
  departmentId: Joi.number().required(),
  expiryDate: Joi.date().required(),
});
