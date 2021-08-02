import Joi from 'joi';

export const createJobApplicantSchema = (body) => {
  const schema = Joi.object()
    .keys({
      note: Joi.string().optional(),
      jobId: Joi.number().required(),
    })
    .unknown(true);

  return Joi.validate(body, schema);
};
