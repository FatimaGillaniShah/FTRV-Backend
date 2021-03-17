import Joi from 'joi';

export const userLoginSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().required(),
});

export const linkCreateSchema = Joi.object()
  .keys({
    name: Joi.string().required(),
    url: Joi.string().required(),
  })
  .unknown(true);

export const linkUpdateSchema = Joi.object()
  .keys({
    name: Joi.string(),
    url: Joi.string(),
  })
  .unknown(true);
