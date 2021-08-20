import Joi from 'joi';
import moment from 'moment';

export const createPollSchema = ({ body, query }) => {
  const schema = Joi.object()
    .keys({
      question: Joi.string().required(),
      startDate: Joi.date().required().min(moment(query.date).format('YYYY-MM-DD')),
      endDate: Joi.date().required().min(moment(query.date).format('YYYY-MM-DD')),
      status: Joi.string().required(),
      options: Joi.array().items(Joi.string()).min(2).max(4),
    })
    .unknown(true);
  return Joi.validate(body, schema);
};
