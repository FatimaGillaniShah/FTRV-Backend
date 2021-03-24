import express from 'express';
import Joi from 'joi';
import models from '../../models';
import { listQuery } from './query';
import { BadRequestError, getErrorMessages, SuccessResponse } from '../../utils/helper';

const { Content } = models;
class QuoteController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.put('/', this.updateQuote);
    return this.router;
  }

  static async list(req, res, next) {
    try {
      const query = listQuery();
      const {
        data: { quote },
      } = await Content.findOne(query);
      return SuccessResponse(res, quote);
    } catch (e) {
      next(e);
    }
  }

  static async updateQuote(req, res, next) {
    const quoteSchema = Joi.object().keys({
      data: Joi.string(),
    });
    const { data } = req.body;
    try {
      const result = Joi.validate(req.body, quoteSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), 422);
      }
      const query = {
        where: {
          name: 'QUOTE',
        },
      };

      await Content.update({ data: { quote: data } }, query);
      return SuccessResponse(res, data);
    } catch (e) {
      next(e);
    }
  }
}

export default QuoteController;
