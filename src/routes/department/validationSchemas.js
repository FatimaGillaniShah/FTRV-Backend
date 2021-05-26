import Joi from 'joi';

export const departmentSchema = Joi.object().keys({
  name: Joi.string().required(),
});
