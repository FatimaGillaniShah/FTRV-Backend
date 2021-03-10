import Joi from 'joi';

export const userLoginSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().required(),
});

export const userSignUpSchema = Joi.object()
  .keys({
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().min(2).max(100).required(),
    lastName: Joi.string().min(2).max(100).required(),
    contactNo: Joi.string().alphanum(),
    extension: Joi.string(),
    location: Joi.string().required(),
    title: Joi.string().required(),
    department: Joi.string().required(),
  })
  .unknown(true);

export const userUpdateSchema = Joi.object()
  .keys({
    password: Joi.string(),
    firstName: Joi.string().min(2).max(100),
    lastName: Joi.string().min(2).max(100),
    contactNo: Joi.string().alphanum(),
    extension: Joi.string(),
    location: Joi.string(),
    title: Joi.string(),
    department: Joi.string(),
  })
  .unknown(true);
