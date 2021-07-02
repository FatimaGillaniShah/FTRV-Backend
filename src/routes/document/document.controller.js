import express from 'express';
import Joi from 'joi';
import models from '../../models';
import {
  BadRequestError,
  cleanUnusedImages,
  getErrorMessages,
  SuccessResponse,
} from '../../utils/helper';
import { documentCreateSchema, documentUpdateSchema } from './validationSchemas';
import { STATUS_CODES } from '../../utils/constants';
import uploadFile from '../../middlewares/upload';
import { getDocumentByIdQuery } from './query';

const { Document } = models;
class DocumentController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', uploadFile('document').single('file'), this.createDocument);
    this.router.put('/:id', uploadFile('document').single('file'), this.updateDocument);
    this.router.get('/:id', this.getDocumentById);

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
        return SuccessResponse(res, document);
      }
      BadRequestError(`Please attach document`, STATUS_CODES.INVALID_INPUT);
    } catch (e) {
      next(e);
    }
  }

  static async updateDocument(req, res, next) {
    const {
      body: documentPayload,
      file = {},
      params: { id: documentId },
    } = req;
    try {
      const result = Joi.validate(documentPayload, documentUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const updateQuery = {
        where: {
          id: documentId,
        },
      };
      const documentExist = await Document.findOne(updateQuery);
      if (documentExist) {
        documentPayload.url = file.key || documentExist.url;
        const document = await Document.update(documentPayload, updateQuery);
        if (file.key && documentExist.url) {
          const urlKeyObj = [{ Key: documentExist.url }];
          cleanUnusedImages(urlKeyObj);
        }
        return SuccessResponse(res, document);
      }
      BadRequestError(`Document does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }

  static async getDocumentById(req, res, next) {
    const {
      params: { id: documentId },
    } = req;

    try {
      if (!documentId) {
        BadRequestError(`Document id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const query = getDocumentByIdQuery(documentId);
      const document = await Document.findOne(query);
      return SuccessResponse(res, document);
    } catch (e) {
      next(e);
    }
  }
}

export default DocumentController;
