import express from 'express';
import Joi from 'joi';
import models from '../../models';
import { listQuery } from './query';
import {
  BadRequestError,
  generatePreSignedUrlForGetObject,
  cleanUnusedFiles,
  getErrorMessages,
  SuccessResponse,
} from '../../utils/helper';
import uploadFile from '../../middlewares/upload';
import { STATUS_CODES } from '../../utils/constants';

const { Content } = models;
class CeoController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.put('/', uploadFile('image').single('file'), this.updateCeoPage);
    return this.router;
  }

  static async list(req, res, next) {
    try {
      const query = listQuery();
      const { data = {} } = await Content.findOne(query);
      if (data.avatar) {
        data.avatar = generatePreSignedUrlForGetObject(data.avatar);
      }
      return SuccessResponse(res, data);
    } catch (e) {
      next(e);
    }
  }

  static async updateCeoPage(req, res, next) {
    const ceoPageContentSchema = Joi.object().keys({
      content: Joi.string().allow(''),
      file: Joi.string().allow(null, ''),
    });
    const { body: ceoPagePayload, file = {} } = req;
    try {
      const result = Joi.validate(ceoPagePayload, ceoPageContentSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const contentQuery = listQuery();
      const { data: existingContent } = await Content.findOne(contentQuery);

      const query = {
        where: {
          name: 'CEO-PAGE',
        },
      };

      const data = {
        content: ceoPagePayload.content,
        avatar: file.key ? file.key : existingContent.avatar,
      };
      if (ceoPagePayload.file === '') {
        data.avatar = '';
      }

      await Content.update({ data }, query);
      if (
        (file.key && existingContent.avatar) ||
        (existingContent.avatar && ceoPagePayload.file === '')
      ) {
        const avatarKeyObj = [{ Key: existingContent.avatar }];
        cleanUnusedFiles(avatarKeyObj);
      }
      return SuccessResponse(res, data);
    } catch (e) {
      next(e);
    }
  }
}

export default CeoController;
