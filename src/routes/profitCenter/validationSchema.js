import Joi from 'joi';

export const createProfitCenterSchema = ({ body }) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      address: Joi.string().required(),
      managerId: Joi.number().required(),
      code: Joi.string().required(),
      faxNumber: Joi.number(),
      contactNo: Joi.string().required(),
      centerNumber: Joi.number().required(),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};

export const updateProfitCenterSchema = ({ body }) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string().required(),
    managerId: Joi.number().required(),
    code: Joi.string().required(),
    faxNumber: Joi.number(),
    contactNo: Joi.string().required(),
    centerNumber: Joi.number().required(),
  });
  return Joi.validate(body, schema);
};
