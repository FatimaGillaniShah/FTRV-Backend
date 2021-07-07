import Joi from 'joi';

export const documentCreateSchema = Joi.object()
  .keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    departmentId: Joi.number().required(),
  })
  .unknown(true);

export const documentUpdateSchema = Joi.object()
  .keys({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    departmentId: Joi.number().optional(),
  })
  .unknown(true);

const sortDocumentSchema = Joi.object().keys({
  id: Joi.number().required(),
  sortOrder: Joi.number().required(),
});

export const sortDocumentsSchema = Joi.array().items(sortDocumentSchema);
