import express from 'express';
import Joi from 'joi';
import models from '../../models';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { documentCreateSchema } from './validationSchemas';
import { STATUS_CODES } from '../../utils/constants';
import uploadFile from '../../middlewares/upload';

const { Document } = models;
class DocumentController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', uploadFile('document').single('file'), this.createDocument);

    return this.router;
  }

  static async createDocument(req, res, next) {
    const { body: documentPayload, file = {} } = req;
    try {
      const result = Joi.validate(documentPayload, documentCreateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      if (file.key) {
        documentPayload.url = file.key;
        const document = await Document.create(documentPayload);
        const documentResponse = document.toJSON();
        return SuccessResponse(res, documentResponse);
      }
      BadRequestError(`Please attach document`, STATUS_CODES.INVALID_INPUT);
    } catch (e) {
      next(e);
    }
  }
}

export default DocumentController;
