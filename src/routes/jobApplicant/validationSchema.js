import Joi from 'joi';

export const createJobApplicantSchema = Joi.object().keys({
  resume: Joi.string().required(),
  note: Joi.string().required(),
  jobId: Joi.number().required(),
});
