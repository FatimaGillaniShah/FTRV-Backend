import express from 'express';
import Joi from 'joi';
import models from '../../models';
import { listQuery } from './query';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { linkCategoryCreateSchema } from './validationSchemas';

const { LinkCategory } = models;
class LinkCategoryController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createLinkCategory);

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

  static async createLinkCategory(req, res, next) {
    const { body: linkCategoryPayload } = req;
    try {
      const result = Joi.validate(linkCategoryPayload, linkCategoryCreateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), 422);
      }

      const linkCategory = await LinkCategory.create(linkCategoryPayload);
      const linkCategoryResponse = linkCategory.toJSON();
      return SuccessResponse(res, linkCategoryResponse);
    } catch (e) {
      next(e);
    }
  }
}

export default LinkCategoryController;
