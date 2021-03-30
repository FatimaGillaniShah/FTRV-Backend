import Joi from 'joi';

export const eventCreateSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  startDate: Joi.date().required(),
  endDate: Joi.string().required(),
});
