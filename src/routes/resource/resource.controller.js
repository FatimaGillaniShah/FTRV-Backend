import express from 'express';
import models from '../../models';
import { SuccessResponse } from '../../utils/helper';
import { Request } from '../../utils/decorators';
import { listQuery } from './query';

const { Resource } = models;
class ResourceController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);

    return this.router;
  }

  @Request
  static async list(req, res) {
    const {
      query: { name },
    } = req;
    const query = listQuery({ name });
    const resources = await Resource.findAll(query);
    return SuccessResponse(res, resources);
  }
}

export default ResourceController;
