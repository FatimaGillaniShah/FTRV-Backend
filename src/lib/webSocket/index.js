import debugObj from 'debug';

const debug = debugObj('api:websocketclass');

class WebSocket {
  constructor() {
    // make this class singleton
    if (!this.constructor.instance) {
      this.constructor.instance = this;
    }

    this.webSockets = new Map();

    return this.constructor.instance;
  }

  getAll() {
    return this.webSockets;
  }

  hasUser(userId) {
    return this.webSockets.has(userId);
  }

  getUser(userId) {
    return this.webSockets.get(userId);
  }

  setUser(userId, user) {
    this.webSockets.set(userId, user);
  }

  deleteUser(userId) {
    this.webSockets.delete(userId);
  }

  sendMessage(userId, message) {
    const user = this.getUser(userId);
    const stringifiedMessage = JSON.stringify(message);
    if (user?.isAdmin) {
      debug(
        `User is admin: ${user?.fullName} with id: ${userId}, we are not sending messages to admin`
      );
    } else if (user?.ws) {
      user.ws.forEach((userWs) => {
        userWs.send(stringifiedMessage);
        debug(`Message sent to user: ${user?.fullName} with id: ${user?.id}`);
      });
    } else {
      debug(
        `Websocket not found for user: ${user?.fullName} with id: ${userId} while sending message ${stringifiedMessage}`
      );
    }
  }
}

export default WebSocket;
