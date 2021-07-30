import Joi from 'joi';

export const createJobApplicantSchema = Joi.object()
  .keys({
    note: Joi.string().optional(),
    jobId: Joi.number().required(),
  })
  .unknown(true);
