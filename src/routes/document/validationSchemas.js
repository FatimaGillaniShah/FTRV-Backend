import Joi from 'joi';

export const documentCreateSchema = Joi.object()
  .keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    departmentId: Joi.number().required(),
  })
  .unknown(true);
