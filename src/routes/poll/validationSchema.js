import Joi from 'joi';

export const createPollSchema = (body) => {
  const schema = Joi.object().keys({
    question: Joi.string().required(),
    startDate: Joi.date().required(),
    endDate: Joi.string().required(),
    status: Joi.string().required(),
    options: Joi.array().items(Joi.object().keys().min(2)),
  });
  return Joi.validate(body, schema);
};
