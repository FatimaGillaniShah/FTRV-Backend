import express from 'express';
import Joi from 'joi';
import models from '../../models';
import { listQuery } from './query';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { linkCategoryCreateSchema, linkCategoryUpdateSchema } from './validationSchemas';
import { STATUS_CODES } from '../../utils/constants';

const { LinkCategory, UsefulLink } = models;
class LinkCategoryController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createLinkCategory);
    this.router.put('/:id', this.updateLinkCategory);
    this.router.get('/:id', this.getLinkCategoryById);
    this.router.delete('/:id', this.deleteLinkCategory);

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
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }

      const linkCategory = await LinkCategory.create(linkCategoryPayload);
      const linkCategoryResponse = linkCategory.toJSON();
      return SuccessResponse(res, linkCategoryResponse);
    } catch (e) {
      next(e);
    }
  }

  static async updateLinkCategory(req, res, next) {
    const {
      body: linkCategoryPayload,
      params: { id: linkCategoryId },
    } = req;
    try {
      const result = Joi.validate(linkCategoryPayload, linkCategoryUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), 422);
      }
      const query = {
        where: {
          id: linkCategoryId,
        },
      };
      const linkCategoryExists = await LinkCategory.findOne(query);
      if (linkCategoryExists) {
        const linkCategory = await LinkCategory.update(linkCategoryPayload, query);
        return SuccessResponse(res, linkCategory);
      }
      BadRequestError(`Category does not exist`);
    } catch (e) {
      next(e);
    }
  }

  static async getLinkCategoryById(req, res, next) {
    const {
      params: { id },
    } = req;
    try {
      if (!id) {
        BadRequestError(`Category Id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const linkCategory = await LinkCategory.findOne({
        where: { id },
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      });
      return SuccessResponse(res, linkCategory);
    } catch (e) {
      next(e);
    }
  }

  static async deleteLinkCategory(req, res, next) {
    const {
      params: { id },
    } = req;
    try {
      if (!id) {
        BadRequestError(`Category Id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const linksCount = await UsefulLink.count({
        where: { categoryId: id },
      });
      if (linksCount > 0) {
        BadRequestError(
          `Category cannot be deleted. It have ${linksCount} link(s)`,
          STATUS_CODES.FORBIDDEN
        );
      }

      const categoriesDeleted = await LinkCategory.destroy({
        where: {
          id,
        },
      });
      return SuccessResponse(res, { count: categoriesDeleted });
    } catch (e) {
      next(e);
    }
  }
}

export default LinkCategoryController;
