import Joi from 'joi';

export const linkCategoryCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
});
