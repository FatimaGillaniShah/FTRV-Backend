import Joi from 'joi';
import moment from 'moment';

export const createPollSchema = ({ body, query: { date = new Date() } }) => {
  const schema = Joi.object()
    .keys({
      question: Joi.string().required(),
      startDate: Joi.date().required().min(moment(date).format('YYYY-MM-DD')),
      endDate: Joi.date().required().min(moment(date).format('YYYY-MM-DD')),
      status: Joi.string().required(),
      options: Joi.array().items(Joi.string()).min(2).max(4).required(),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};

export const updatePollSchema = ({ body, query: { date = new Date() } }) => {
  const schema = Joi.object()
    .keys({
      question: Joi.string().optional(),
      startDate: Joi.date().optional().min(moment(date).format('YYYY-MM-DD')),
      endDate: Joi.date().optional().min(moment(date).format('YYYY-MM-DD')),
      status: Joi.string().optional(),
      options: Joi.array().items().min(2).max(4).optional(),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};

export const savePollResultSchema = ({ body }) => {
  const schema = Joi.object()
    .keys({
      pollOptionId: Joi.number().required(),
      pollId: Joi.number().required(),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};
