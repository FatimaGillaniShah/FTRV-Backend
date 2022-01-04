import Joi from 'joi';

export const groupCreateSchema = ({ body }) => {
  const schema = Joi.object().keys({
    name: Joi.string().required(),
    resources: Joi.array().items().min(1).required(),
    description: Joi.string().optional().allow(null, ''),
  });
  return Joi.validate(body, schema);
};
