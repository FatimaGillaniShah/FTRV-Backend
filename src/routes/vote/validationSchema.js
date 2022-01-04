import Joi from 'joi';

export const savePollResultSchema = ({ body }) => {
  const schema = Joi.object()
    .keys({
      pollOptionId: Joi.number().required(),
      pollId: Joi.number().required(),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};
