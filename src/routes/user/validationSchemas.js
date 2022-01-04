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
    contactNo: Joi.string()
      .regex(/(\d{3})-(\d{3})-(\d{4})/)
      .allow(null, ''),
    extension: Joi.string().allow(null, ''),
    locationId: Joi.number().required(),
    title: Joi.string().required(),
    departmentId: Joi.number().required(),
    joiningDate: Joi.date().allow(''),
    dob: Joi.date().allow(''),
    groupIds: Joi.array().items().min(1).required(),
  })
  .unknown(true);

export const userUpdateSchema = Joi.object()
  .keys({
    password: Joi.string(),
    firstName: Joi.string().min(2).max(100),
    lastName: Joi.string().min(2).max(100),
    contactNo: Joi.string()
      .regex(/(\d{3})-(\d{3})-(\d{4})/)
      .allow(null, ''),
    extension: Joi.string().allow(null, ''),
    locationId: Joi.number(),
    title: Joi.string(),
    departmentId: Joi.number(),
    joiningDate: Joi.date().allow(''),
    dob: Joi.date().allow(''),
    groupIds: Joi.array().items().min(1),
  })
  .unknown(true);

export const userBulkUpdateSchema = ({ body }) => {
  const schema = Joi.object()
    .keys({
      userIds: Joi.array().required(),
      locationId: Joi.number(),
      departmentId: Joi.number(),
      groupId: Joi.array(),
    })
    .min(1)
    .unknown(true);
  return Joi.validate(body, schema);
};
