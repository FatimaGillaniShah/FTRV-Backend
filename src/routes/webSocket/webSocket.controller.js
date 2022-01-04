import express from 'express';
import { SuccessResponse } from '../../utils/helper';
import { Request } from '../../utils/decorators';
import WebSocket from '../../lib/webSocket';

class WebSocketController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);

    return this.router;
  }

  @Request
  static async list(req, res) {
    const userMap = new WebSocket();
    const connections = Array.from(userMap.getAll(), ([userId, user]) => userId && user);
    const response = {
      count: connections.length,
      connections,
    };
    return SuccessResponse(res, response);
  }
}
export default WebSocketController;
