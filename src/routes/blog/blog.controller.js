import express from 'express';
import models from '../../models';

import { SuccessResponse } from '../../utils/helper';
import { listQuery } from './query';

const { Blog } = models;

class BlogController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);

    return this.router;
  }

  static async list(req, res, next) {
    const {
      query: { sortColumn, sortOrder, pageNumber = 1, pageSize },
    } = req;
    try {
      const query = listQuery({
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
      });
      const blogs = await Blog.findAndCountAll(query);
      return SuccessResponse(res, blogs);
    } catch (e) {
      next(e);
    }
  }
}

export default BlogController;
