import Joi from 'joi';

export const departmentCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
});

export const departmentUpdateSchema = Joi.object().keys({
  name: Joi.string().required(),
});
