import Joi from 'joi';
import express from 'express';
import models from '../../models';
import { PAGE_SIZE } from '../../utils/constants';
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
      query: { sortColumn, sortOrder, pageNumber = 1, pageSize = PAGE_SIZE },
    } = req;
    try {
      if (pageNumber <= 0) {
        BadRequestError('Invalid page number', 422);
      }

      const query = listQuery({
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
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
        BadRequestError(`Link id is required`, 422);
      }
      const link = await UsefulLink.findOne({
        where: {
          id,
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
        BadRequestError(getErrorMessages(result), 422);
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
        BadRequestError(getErrorMessages(result), 422);
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
      BadRequestError(`Useful Link does not exists`, 404);
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
        BadRequestError(`Link ids required`, 422);
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
