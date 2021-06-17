import express from 'express';
import models from '../../models';
import { listQuery } from './query';
import uploadFile from '../../middlewares/upload';
import {
  BadRequestError,
  generatePreSignedUrlForGetObject,
  cleanUnusedImages,
  SuccessResponse,
} from '../../utils/helper';
import { STATUS_CODES } from '../../utils/constants';

const { Content } = models;
class BannerImageController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.put('/', uploadFile('image').single('file'), this.updateBannerImage);
    return this.router;
  }

  static async list(req, res, next) {
    try {
      const query = listQuery();
      const { data = {} } = await Content.findOne(query);
      if (data.fileName) {
        data.fileName = generatePreSignedUrlForGetObject(data.fileName);
      }
      return SuccessResponse(res, data);
    } catch (e) {
      next(e);
    }
  }

  static async updateBannerImage(req, res, next) {
    const { file } = req;
    try {
      if (!file) {
        BadRequestError('File required', STATUS_CODES.INVALID_INPUT);
      }
      const query = listQuery();
      const updateQuery = {
        where: {
          name: 'HOME-BANNER-IMAGE',
        },
      };
      const data = {
        fileName: file.key,
      };

      await Content.update({ data }, updateQuery);
      const {
        data: { fileName },
      } = await Content.findOne(query);
      if (fileName && file.key) {
        const fileKeyObj = [{ Key: fileName }];
        cleanUnusedImages(fileKeyObj);
      }
      return SuccessResponse(res, data);
    } catch (e) {
      next(e);
    }
  }
}

export default BannerImageController;
