import express from 'express';
import models from '../../models';
import { listQuery } from './query';
import { SuccessResponse } from '../../utils/helper';

const { Announcement } = models;

class AnnouncementController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    return this.router;
  }

  static async list(req, res, next) {
    try {
      const query = listQuery({
        status: 'active',
      });
      const result = await Announcement.findAll(query);
      return SuccessResponse(res, result);
    } catch (e) {
      next(e);
    }
  }
}

export default AnnouncementController;
