import Joi from 'joi';

export const linkCategoryCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
});

export const linkCategoryUpdateSchema = Joi.object().keys({
  name: Joi.string().required(),
});
