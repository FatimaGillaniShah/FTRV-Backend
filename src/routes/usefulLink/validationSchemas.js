import Joi from 'joi';

export const linkCreateSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    url: Joi.string().required(),
    categoryId: Joi.number().required(),
  })
  .unknown(true);

export const linkUpdateSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    url: Joi.string().required(),
    categoryId: Joi.number().required(),
  })
  .unknown(true);
