import Joi from 'joi';
import express from 'express';
import models from '../../models';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { listQuery } from './query';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { linkCreateSchema, linkUpdateSchema } from './validationSchemas';

const { UsefulLink } = models;
class UsefulLinkController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createLink);
    this.router.put('/:id', this.updateLink);
    this.router.get('/:id', this.getLinkById);
    this.router.delete('/deleteLinks', this.deleteLinks);
    return this.router;
  }

  static async list(req, res, next) {
    const {
      query: { categoryId, sortColumn, sortOrder, pageNumber = 1, pageSize = PAGE_SIZE },
    } = req;
    try {
      if (pageNumber <= 0) {
        BadRequestError('Invalid page number', STATUS_CODES.INVALID_INPUT);
      }
      if (categoryId === undefined) {
        BadRequestError('Category required', STATUS_CODES.INVALID_INPUT);
      }

      const query = listQuery({
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
        categoryId,
      });
      const usefulLinks = await UsefulLink.findAndCountAll(query);
      return SuccessResponse(res, usefulLinks);
    } catch (e) {
      next(e);
    }
  }

  static async getLinkById(req, res, next) {
    const {
      params: { id },
    } = req;

    try {
      if (!id) {
        BadRequestError(`Link id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const link = await UsefulLink.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
      });
      return SuccessResponse(res, link);
    } catch (e) {
      next(e);
    }
  }

  static async createLink(req, res, next) {
    const { body: linkPayload } = req;
    try {
      const result = Joi.validate(linkPayload, linkCreateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          url: linkPayload.url,
        },
      };

      const linkExists = await UsefulLink.findOne(query);
      if (!linkExists) {
        const link = await UsefulLink.create(linkPayload);
        const linkResponse = link.toJSON();
        return SuccessResponse(res, linkResponse);
      }
      BadRequestError(`Useful Link "${linkExists.url}" already exists`);
    } catch (e) {
      next(e);
    }
  }

  static async updateLink(req, res, next) {
    const {
      body: linkPayload,
      params: { id: linkId },
    } = req;
    try {
      const result = Joi.validate(linkPayload, linkUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: linkId,
        },
      };

      const linkExists = await UsefulLink.findOne(query);
      if (linkExists) {
        const link = await UsefulLink.update(linkPayload, query);
        return SuccessResponse(res, link);
      }
      BadRequestError(`Useful Link does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }

  static async deleteLinks(req, res, next) {
    const {
      body: { ids = [] },
    } = req;
    try {
      if (ids.length < 1) {
        BadRequestError(`Link ids required`, STATUS_CODES.INVALID_INPUT);
      }
      const links = await UsefulLink.destroy({
        where: {
          id: ids,
        },
        force: true,
      });
      return SuccessResponse(res, { count: links });
    } catch (e) {
      next(e);
    }
  }
}

export default UsefulLinkController;
