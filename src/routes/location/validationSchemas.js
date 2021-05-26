import Joi from 'joi';

export const locationCreateSchema = Joi.object().keys({
  name: Joi.string().required(),
});
export const locationUpdateSchema = Joi.object()
  .keys({
    name: Joi.string(),
  })
  .unknown(true);
