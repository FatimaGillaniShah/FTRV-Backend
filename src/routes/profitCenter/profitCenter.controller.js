import express from 'express';
import { BadRequestError, SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { Request } from '../../utils/decorators';
import { PAGE_SIZE, STATUS_CODES } from '../../utils/constants';
import { deleteProfitCenterQuery, listProfitCentersQuery } from './query';

const { ProfitCenter } = models;

class ProfitCenterController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.delete('/', this.deleteProfitCenter);

    return this.router;
  }

  @Request
  static async list(req, res) {
    const {
      query: { sortOrder, sortColumn, pageNumber = 1, pageSize = PAGE_SIZE, searchString },
    } = req;
    const query = listProfitCentersQuery({
      sortOrder,
      sortColumn,
      pageNumber,
      pageSize,
      searchString,
    });
    const profitCenters = await ProfitCenter.findAndCountAll(query);
    return SuccessResponse(res, profitCenters);
  }

  @Request
  static async deleteProfitCenter(req, res) {
    const {
      body: { ids: profitCenterIds = [] },
    } = req;

    if (profitCenterIds.length < 1) {
      BadRequestError(`Profit Center id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const profitCenterCount = await ProfitCenter.destroy(deleteProfitCenterQuery(profitCenterIds));
    return SuccessResponse(res, { count: profitCenterCount });
  }
}
export default ProfitCenterController;
