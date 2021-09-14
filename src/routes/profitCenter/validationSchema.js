import Joi from 'joi';

export const createProfitCenterSchema = ({ body }) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      address: Joi.string().required(),
      managerId: Joi.number().allow(null, ''),
      code: Joi.string().required(),
      faxNo: Joi.string(),
      contactNo: Joi.string().required(),
      centerNo: Joi.number().required(),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};

export const updateProfitCenterSchema = ({ body }) => {
  const schema = Joi.object().keys({
    name: Joi.string().optional(),
    address: Joi.string().optional(),
    managerId: Joi.number().optional().allow(null, ''),
    code: Joi.string().optional(),
    faxNo: Joi.string().optional(),
    contactNo: Joi.string().optional(),
    centerNo: Joi.number().optional(),
  });
  return Joi.validate(body, schema);
};
