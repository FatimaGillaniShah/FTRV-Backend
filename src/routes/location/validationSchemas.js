import Joi from 'joi';

export const locationSchema = Joi.object().keys({
  name: Joi.string().required(),
});
