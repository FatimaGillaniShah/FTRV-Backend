import Joi from 'joi';

export const announcementCreateSchema = Joi.object()
  .keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    status: Joi.string().required().valid('active', 'inactive'),
    priority: Joi.string().required().valid('high', 'medium', 'low'),
  })
  .unknown(true);

export const announcementUpdateSchema = Joi.object()
  .keys({
    title: Joi.string(),
    description: Joi.string(),
    startTime: Joi.date(),
    endTime: Joi.date(),
    status: Joi.string().valid('active', 'inactive'),
    priority: Joi.string().valid('high', 'medium', 'low'),
  })
  .unknown(true);
