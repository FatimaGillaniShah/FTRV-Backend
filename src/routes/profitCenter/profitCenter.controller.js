import express from 'express';
import { SuccessResponse, BadRequestError } from '../../utils/helper';
import models from '../../models';
import { getProfileCenterByIdQuery, updateProfitCenterQuery } from './query';
import { STATUS_CODES } from '../../utils/constants';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import { createProfitCenterSchema, updateProfitCenterSchema } from './validationSchema';

const { ProfitCenter } = models;

class ProfitCenterController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createProfitCenter);
    this.router.get('/:id', this.getProfitCenterById);
    this.router.put('/:id', this.updateProfitCenter);
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

  @Request
  static async getProfitCenterById(req, res) {
    const {
      params: { id: profitCenterId },
    } = req;
    if (!profitCenterId) {
      BadRequestError(`Profile Center id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const query = getProfileCenterByIdQuery(profitCenterId);
    const profitCenterResponse = await ProfitCenter.findOne(query);
    return SuccessResponse(res, profitCenterResponse);
  }

  @Request
  @RequestBodyValidator(updateProfitCenterSchema)
  static async updateProfitCenter(req, res) {
    const {
      body: profitCenterPayload,
      params: { id },
      user,
    } = req;
    const profitCenterExist = await ProfitCenter.findOne(updateProfitCenterQuery(id));
    if (profitCenterExist) {
      profitCenterPayload.updatedBy = user.id;
      const profitCenter = await ProfitCenter.update(
        profitCenterPayload,
        updateProfitCenterQuery(id)
      );
      return SuccessResponse(res, profitCenter);
    }
    BadRequestError(`Profit Center does not exist`, STATUS_CODES.NOTFOUND);
  }
}
export default ProfitCenterController;
