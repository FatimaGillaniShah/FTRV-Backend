import Joi from 'joi';

export const blogCreateSchema = Joi.object()
  .keys({
    title: Joi.string().required(),
    content: Joi.string().required(),
  })
  .unknown(true);

export const blogUpdateSchema = Joi.object()
  .keys({
    title: Joi.string().optional(),
    content: Joi.string().optional(),
  })
  .unknown(true);
