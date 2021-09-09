import express from 'express';
import { SuccessResponse } from '../../utils/helper';
import models from '../../models';
import { Request } from '../../utils/decorators';
import { PAGE_SIZE } from '../../utils/constants';
import { listProfitCentersQuery } from './query';

const { ProfitCenter } = models;

class ProfitCenterController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);

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
}
export default ProfitCenterController;
