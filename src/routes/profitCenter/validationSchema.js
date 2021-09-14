import Joi from 'joi';

export const createProfitCenterSchema = ({ body }) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      address: Joi.string().required(),
      managerId: Joi.number(),
      code: Joi.string().required(),
      faxNumber: Joi.string(),
      contactNo: Joi.string().required(),
      centerNumber: Joi.number().required(),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};
