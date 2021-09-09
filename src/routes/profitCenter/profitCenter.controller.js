import express from 'express';
import { SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import { createProfitCenterSchema } from './validationSchema';

const { ProfitCenter } = models;

class ProfitCenterController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createProfitCenter);
    return this.router;
  }

  @RequestBodyValidator(createProfitCenterSchema)
  @Request
  static async createProfitCenter(req, res) {
    const { body: profitCenterPayload, user } = req;
    profitCenterPayload.createdBy = user.id;
    const profitCenter = await ProfitCenter.create(profitCenterPayload);
    return SuccessResponse(res, profitCenter);
  }
}
export default ProfitCenterController;
