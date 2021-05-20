import Joi from 'joi';
import express from 'express';
import models from '../../models';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { listQuery, dashboardListQuery } from './query';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';
import { announcementCreateSchema, announcementUpdateSchema } from './validationSchemas';

const { Announcement } = models;

class AnnouncementController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', this.createAnnouncement);
    this.router.get('/userAnnouncements', this.userAnnouncements);
    this.router.put('/:id', this.updateAnnouncement);
    this.router.get('/:id', this.getAnnouncementById);
    this.router.delete('/deleteAnnouncements', this.deleteAnnouncements);
    return this.router;
  }

  static async list(req, res, next) {
    const {
      query: { sortColumn, sortOrder, pageNumber = 1, pageSize = PAGE_SIZE },
    } = req;
    try {
      if (pageNumber <= 0) {
        BadRequestError('Invalid page number', STATUS_CODES.INVALID_INPUT);
      }

      const query = listQuery({
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
      });
      const announcements = await Announcement.findAndCountAll(query);
      return SuccessResponse(res, announcements);
    } catch (e) {
      next(e);
    }
  }

  static async userAnnouncements(req, res, next) {
    try {
      const query = dashboardListQuery({
        status: 'active',
      });
      const result = await Announcement.findAll(query);
      return SuccessResponse(res, result);
    } catch (e) {
      next(e);
    }
  }

  static async getAnnouncementById(req, res, next) {
    const {
      params: { id },
    } = req;

    try {
      if (!id) {
        BadRequestError(`Announcement id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const announcement = await Announcement.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt'],
        },
      });
      return SuccessResponse(res, announcement);
    } catch (e) {
      next(e);
    }
  }

  static async createAnnouncement(req, res, next) {
    const { body: announcementPayload } = req;
    try {
      const result = Joi.validate(announcementPayload, announcementCreateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const announcement = await Announcement.create(announcementPayload);
      const announcementResponse = announcement.toJSON();
      return SuccessResponse(res, announcementResponse);
    } catch (e) {
      next(e);
    }
  }

  static async updateAnnouncement(req, res, next) {
    const {
      body: announcementPayload,
      params: { id: announcementId },
    } = req;
    try {
      const result = Joi.validate(announcementPayload, announcementUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: announcementId,
        },
      };

      const announcementExists = await Announcement.findOne(query);
      if (announcementExists) {
        const announcement = await Announcement.update(announcementPayload, query);
        return SuccessResponse(res, announcement);
      }
      BadRequestError(`Announcement does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }

  static async deleteAnnouncements(req, res, next) {
    const {
      body: { ids = [] },
    } = req;
    try {
      if (ids.length < 1) {
        BadRequestError(`Announcement ids required`, STATUS_CODES.INVALID_INPUT);
      }
      const announcements = await Announcement.destroy({
        where: {
          id: ids,
        },
        force: true,
      });
      return SuccessResponse(res, { count: announcements });
    } catch (e) {
      next(e);
    }
  }
}

export default AnnouncementController;
