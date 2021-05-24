import express from 'express';
import models from '../../models';
import { listQuery } from './query';
import { SuccessResponse } from '../../utils/helper';

const { Content } = models;
class BannerImageController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    return this.router;
  }

  static async list(req, res, next) {
    try {
      const query = listQuery();
      const data = await Content.findOne(query);
      return SuccessResponse(res, data);
    } catch (e) {
      next(e);
    }
  }
}

export default BannerImageController;
