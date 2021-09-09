import Joi from 'joi';
import moment from 'moment';

export const createProfitCenterSchema = ({ body }) => {
  const schema = Joi.object()
    .keys({
      name: Joi.string().required(),
      code: Joi.string().required(),
      faxNumber: Joi.number().required(),
      contactNo: Joi.number().required(),
      centerNumber: Joi.number().required(),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};

