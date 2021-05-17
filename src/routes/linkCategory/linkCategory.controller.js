import express from 'express';
import models from '../../models';
import { listQuery } from './query';
import { SuccessResponse } from '../../utils/helper';

const { LinkCategory } = models;
class LinkCategoryController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);

    return this.router;
  }

  static async list(req, res, next) {
    try {
      const query = listQuery();
      const categories = await LinkCategory.findAll(query);
      return SuccessResponse(res, categories);
    } catch (e) {
      next(e);
    }
  }
}

export default LinkCategoryController;
