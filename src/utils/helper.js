import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import AWS from 'aws-sdk';
import sequelize from 'sequelize';
import moment from 'moment';
import debugObj from 'debug';
import { AWS_CONFIG, STATUS_CODES, TYPES } from './constants';
import { BadRequest, NotFound } from '../error';
import { getTokenFromSocketHeaders } from '../middlewares/auth';
import models from '../models';
import { getUserByIdWithGroups } from '../routes/user/query';
import WebSocket from '../lib/webSocket';

const { Op } = sequelize;
const { User } = models;
const debug = debugObj('api:webSocket');
const userMap = new WebSocket();

const s3 = new AWS.S3({
  accessKeyId: AWS_CONFIG.AWS_ACCESS_KEY,
  secretAccessKey: AWS_CONFIG.AWS_SECRET_KEY,
});

/**
 * Validates that the provided password matches the hashed counterpart
 *
 * @category validation
 * @param {String} password The password provided by the user
 * @param {String} hashedPassword The password stored in your db
 * @returns {Boolean}
 */
const validatePassword = (password, hashedPassword) => password === hashedPassword;

// Hashed passwords !
// const hash = crypto.pbkdf2Sync(password, process.env.SALT, 10000, 512, 'sha512').toString('hex');
// return hash === hashedPassword;
/**
 * Generates Hash for the user password
 *
 * @category validation
 * @param {String} password The password provided by the user
 * @returns {String} password The hashed password
 */
const generateHash = (password) =>
  crypto.pbkdf2Sync(password, process.env.SALT, 10000, 64, 'sha512').toString('hex');

/**
 * generate the json web token that we'll use for authentication
 *
 * @since 1.0.0
 * @category authentication
 * @param    {Any} id The user ID
 * @param    {String} email The email of the user
 * @param    {String} name The name of the user
 * @param    {String} surname The surname of the user
 * @returns  {Object} The generated JWT
 */

const generateJWT = ({ id, email, name, isAdmin }) =>
  jwt.sign(
    {
      id,
      email,
      name,
      isAdmin,
    },
    process.env.JWT_SECRET
  );

const getErrorMessages = (joiErrorObject) => joiErrorObject.error.details.map((e) => e.message);

const getPassportErrorMessage = (errorObject) => errorObject.errors && errorObject.errors.account;

const BadRequestError = (message, code, data) => {
  throw new BadRequest(message, code, data);
};

const NotFoundError = (message, code) => {
  throw new NotFound(message, code);
};

const SuccessResponse = (res, data) => {
  res.status(200).json({
    data,
  });
};

const stripHtmlTags = (htmlString) => htmlString.replace(/(<([^>]+)>)/gi, '');

const cleanUnusedFiles = async (objects) => {
  const params = {
    Bucket: AWS_CONFIG.BUCKET,
    Delete: { Objects: objects },
  };
  await s3.deleteObjects(params).promise();
};

const generatePreSignedUrlForGetObject = (key) =>
  s3.getSignedUrl('getObject', {
    Bucket: AWS_CONFIG.BUCKET,
    Key: key,
    Expires: 60 * 60 * 24, // 1 day expiry
  });

const makeLikeCondition = (columnName, searchValue) => {
  const condition = {};
  condition[columnName] = { [Op.iLike]: `%${searchValue}%` };
  return condition;
};
const makeEqualityCondition = (columnName, searchValue) => {
  const condition = {};
  condition[columnName] = { [Op.eq]: `${searchValue}` };
  return condition;
};

const isPreviousDate = (date, currentDate = new Date()) =>
  moment(currentDate).isAfter(moment(date), 'day');

const flattenPermission = (groups) =>
  groups?.map((value) => {
    let group = value;
    group = group.toJSON();
    const resources = group.resources.map((val) => {
      const resource = val;
      resource.permissions = resource.resourcePermission.permission;
      delete resource.resourcePermission;
      return resource;
    });
    group.resources = resources;
    return group;
  });

const handleVerifyWsClient = async (info, done) => {
  try {
    const token = getTokenFromSocketHeaders(info.req);
    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);
    if (!userId) {
      done(false, STATUS_CODES.INVALID_INPUT, 'Invalid Token');
    }
    const user = await User.findOne(getUserByIdWithGroups({ id: userId }));
    const groups = flattenPermission(user?.groups);
    const userInfo = {
      ...user.toJSON(),
      groups,
    };
    // eslint-disable-next-line no-param-reassign
    info.req.user = userInfo;
    done(true);
  } catch (error) {
    done(false, STATUS_CODES.INVALID_INPUT, 'Invalid Token');
  }
};
const createWebSocketPing = () => {
  const userSockets = new WebSocket();

  setInterval(() => {
    userSockets.getAll().forEach(function each(user) {
      user.ws.forEach((ws) => {
        if (ws.isAlive === false) {
          return ws.terminate();
        }

        // eslint-disable-next-line no-param-reassign
        ws.isAlive = false;
        debug(`Sending ping to user`);
        ws.ping();
      });
    });
  }, 10000);
};

const handleWsClose = ({ user, ws }) => {
  const { fullName, id: userId } = user;
  debug(`Wss on close. Closing websocket for user: ${fullName} with id: ${userId}`);
  if (userMap.hasUser(userId)) {
    const { ws: closeWsArr } = userMap.getUser(userId);
    closeWsArr?.forEach((closeWs, index) => {
      if (closeWs === ws) {
        closeWs.close();
        closeWsArr.splice(index, 1);
      }
    });
    if (closeWsArr?.length > 0) {
      // eslint-disable-next-line no-param-reassign
      user.ws = closeWsArr;
      userMap.setUser(userId, user);
    } else {
      userMap.deleteUser(userId);
    }
  }
};

const handleWsMessage = ({ data, fullName, userId }) => {
  const message = JSON.parse(data);
  debug(`Received message "${message}" from user: "${fullName}" with id: ${userId}`);
};

const convertType = (value) => {
  const isType = value in TYPES;
  if (isType) {
    return TYPES[value];
  }
  return value;
};

const handleWsConnection = (webSocket, request) => {
  const ws = webSocket;

  let { user } = request;
  const { fullName, id: userId } = user;

  debug(`Connection Established with user: ${fullName} with id: ${userId}`);
  ws.isAlive = true;

  if (userMap.hasUser(userId)) {
    user = userMap.getUser(userId);
    user.ws.push(ws);
  } else {
    user.ws = [ws];
  }

  userMap.setUser(userId, user);
  ws.on('pong', function pong() {
    debug(`Recieved pong from user: ${fullName} with id: ${userId}`);
    this.isAlive = true;
  });
  ws.on('message', (data) => handleWsMessage({ data, userId, fullName }));
  ws.on('close', () => handleWsClose({ user, ws }));
};

export {
  stripHtmlTags,
  generateHash,
  validatePassword,
  convertType,
  generateJWT,
  getErrorMessages,
  getPassportErrorMessage,
  BadRequestError,
  NotFoundError,
  SuccessResponse,
  generatePreSignedUrlForGetObject,
  cleanUnusedFiles,
  makeLikeCondition,
  makeEqualityCondition,
  isPreviousDate,
  handleVerifyWsClient,
  handleWsConnection,
  flattenPermission,
  createWebSocketPing,
};
