import Joi from 'joi';
import passport from 'passport';
import path from 'path';
import xlsx from 'node-xlsx';
import debugObj from 'debug';
import moment from 'moment';
import _ from 'lodash';
import fs from 'fs';
import { promisify } from 'util';
import express from 'express';
import { OAuth2Client } from 'google-auth-library';
import models from '../../models';
import uploadFile from '../../middlewares/upload';
import { PAGE_SIZE, STATUS_CODES, UPLOAD_PATH } from '../../utils/constants';
import { BadRequest } from '../../error';
import {
  birthdayQuery,
  anniversaryQuery,
  getUserByIdQuery,
  listQuery,
  listTitleQuery,
} from './query';

import {
  BadRequestError,
  cleanUnusedFiles,
  generateHash,
  generateJWT,
  generatePreSignedUrlForGetObject,
  getErrorMessages,
  getPassportErrorMessage,
  SuccessResponse,
} from '../../utils/helper';
import { userLoginSchema, userSignUpSchema, userUpdateSchema } from './validationSchemas';
import { Request } from '../../utils/decorators';

const debug = debugObj('api:server');
const deleteFileAsync = promisify(fs.unlink);
const { User, Location, Department } = models;
class UserController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', uploadFile('image').single('file'), this.createUser);
    this.router.get('/birthday', this.birthdays);
    this.router.get('/workAnniversary', this.workAnniversaries);
    this.router.get('/title', this.listTitles);
    this.router.put('/:id', uploadFile('image').single('file'), this.updateUser);
    this.router.get('/:id', this.getUserById);
    this.router.post('/login', this.login);
    this.router.post('/googleLogin', this.googleLogin);

    this.router.delete('/deleteUsers', this.deleteUsers);
    this.router.post('/upload', uploadFile('excel').single('file'), this.upload);
    return this.router;
  }

  static generatePreSignedUrl(users) {
    users.forEach((user) => {
      if (user.avatar && !user.avatar.includes('googleusercontent.com')) {
        // eslint-disable-next-line no-param-reassign
        user.avatar = generatePreSignedUrlForGetObject(user.avatar);
      }
    });
  }

  static async birthdays(req, res, next) {
    const { date = new Date() } = req.query;

    try {
      const query = birthdayQuery(date);
      const data = await User.findAll(query);
      UserController.generatePreSignedUrl(data);
      return SuccessResponse(res, data);
    } catch (e) {
      next(e);
    }
  }

  static async workAnniversaries(req, res, next) {
    const { date = new Date() } = req.query;

    try {
      const query = anniversaryQuery(date);
      const data = await User.findAll(query);
      UserController.generatePreSignedUrl(data);
      return SuccessResponse(res, data);
    } catch (e) {
      next(e);
    }
  }

  @Request
  static async listTitles(req, res) {
    const titles = await User.findAll(listTitleQuery());
    return SuccessResponse(res, titles);
  }

  static async list(req, res, next) {
    const {
      query: {
        status,
        searchString,
        name,
        departmentId,
        title,
        extension,
        locationId,
        sortColumn,
        sortOrder,
        detail,
        pageNumber = 1,
        pageSize = PAGE_SIZE,
      },
    } = req;
    try {
      if (pageNumber <= 0) {
        BadRequestError('Invalid page number', STATUS_CODES.INVALID_INPUT);
      }

      const query = listQuery({
        status,
        searchString,
        name,
        departmentId,
        title,
        extension,
        locationId,
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
        detail,
      });
      const users = await User.findAndCountAll(query);
      return SuccessResponse(res, users);
    } catch (e) {
      next(e);
    }
  }

  static async getUserById(req, res, next) {
    const {
      params: { id },
    } = req;

    try {
      if (!id) {
        BadRequestError(`User id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const query = getUserByIdQuery({ id });
      const user = await User.findOne(query);
      UserController.generatePreSignedUrl([user]);
      return SuccessResponse(res, user);
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    const { body: user } = req;

    const result = Joi.validate(user, userLoginSchema, { abortEarly: true });
    if (result.error) {
      return next(new BadRequest(getErrorMessages(result), STATUS_CODES.INVALID_INPUT));
    }

    return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const userObj = {
          id: passportUser.id,
          email: passportUser.email,
          role: passportUser.role,
          name: passportUser.fullName,
          avatar: passportUser.avatar,
          token: generateJWT(passportUser),
        };
        UserController.generatePreSignedUrl([userObj]);
        return SuccessResponse(res, userObj);
      }
      return next(new BadRequest(getPassportErrorMessage(info), STATUS_CODES.INVALID_INPUT));
    })(req, res, next);
  }

  static async googleLogin(req, res, next) {
    const {
      body: { tokenId },
    } = req;

    try {
      if (!tokenId) {
        BadRequestError('Google token missing', STATUS_CODES.INVALID_INPUT);
      }
      const client = new OAuth2Client();
      const ticket = await client.verifyIdToken({
        idToken: tokenId,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const {
        email,
        picture: avatar,
        role = 'user',
        given_name: firstName,
        family_name: lastName,
        exp,
      } = ticket.getPayload();

      if (Math.floor(Date.now() / 1000) > exp) {
        BadRequestError('Token expired. Try again', 400);
      }

      const [user] = await User.findOrCreate({
        where: { email },
        defaults: {
          role,
          status: 'active',
          avatar,
          firstName,
          lastName,
          password: '',
        },
      });

      const userObj = {
        id: user.id,
        email,
        role: user.role,
        name: user.fullName,
        avatar: user.avatar,
        token: generateJWT(user),
      };

      return SuccessResponse(res, userObj);
    } catch (e) {
      next(e);
    }
  }

  static async createUser(req, res, next) {
    const { body: userPayload, file = {} } = req;
    try {
      const result = Joi.validate(userPayload, userSignUpSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          email: userPayload.email,
        },
      };

      const userExists = await User.findOne(query);
      if (!userExists) {
        userPayload.password = generateHash(userPayload.password);
        userPayload.role = userPayload.role || 'user';
        userPayload.status = 'active';
        userPayload.avatar = file.key;
        const user = await User.create(userPayload);
        const userResponse = user.toJSON();
        delete userResponse.password;
        return SuccessResponse(res, userResponse);
      }
      BadRequestError(`User "${userPayload.email}" already exists`);
    } catch (e) {
      next(e);
    }
  }

  static async updateUser(req, res, next) {
    const {
      body: userPayload,
      file = {},
      params: { id: userId },
      user: { id },
    } = req;
    try {
      const result = Joi.validate(userPayload, userUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: userId,
        },
      };

      const userExists = await User.findOne(query);
      if (userExists) {
        if (userPayload.password) {
          userPayload.password = generateHash(userPayload.password);
        }
        if (userPayload.file === '') {
          userPayload.avatar = '';
        } else {
          userPayload.avatar = file.key || userExists.avatar;
        }
        await User.update(userPayload, query);
        delete userPayload.password;
        if (id === parseInt(userId, 10)) {
          UserController.generatePreSignedUrl([userPayload]);
        }

        if ((file.key && userExists.avatar) || (userExists.avatar && userPayload.file === '')) {
          const avatarKeyObj = [{ Key: userExists.avatar }];
          cleanUnusedFiles(avatarKeyObj);
        }
        return SuccessResponse(res, userPayload);
      }
      BadRequestError(`User does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }

  static async deleteUsers(req, res, next) {
    const {
      body: { ids = [] },
    } = req;
    try {
      if (ids.length < 1) {
        BadRequestError(`User ids required`, STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: ids,
        },
      };
      const users = await User.findAll(query);

      const user = await User.destroy({
        where: {
          id: ids,
        },
        force: true,
      });
      const userKeyobjects = _.chain(users)
        .filter((userInfo) => !!userInfo.avatar)
        .map((userInfo) => ({ Key: userInfo.avatar }))
        .value();
      if (userKeyobjects.length > 0) {
        cleanUnusedFiles(userKeyobjects);
      }
      return SuccessResponse(res, { count: user });
    } catch (e) {
      next(e);
    }
  }

  static async upload(req, res, next) {
    try {
      if (req.file === undefined) {
        BadRequestError('No file found.', STATUS_CODES.INVALID_INPUT);
      }
      const ingestStatus = { success: 0, failed: 0 };
      const aggregateResult = (results) => {
        results.forEach((result) => {
          if (result.status === 'success') {
            ingestStatus.success += 1;
          } else if (result.status === 'failed') {
            ingestStatus.failed += 1;
          }
        });
      };
      const excelFilePath = path.join(
        path.dirname(require.main.filename),
        UPLOAD_PATH,
        req.file.filename
      );
      const worksheets = xlsx.parse(excelFilePath);
      debug(`Excel file loading done: ${excelFilePath}`);

      for (let w = 0; w < 1; w += 1) {
        if (worksheets[w].data) {
          const sheetData = worksheets[w].data;
          let headerRow = sheetData[0];
          if (!headerRow) {
            BadRequestError('No row found.', STATUS_CODES.INVALID_INPUT);
          }
          // Remove all spaces and extra characters
          headerRow = headerRow.map((header) => header.toString().replace(/\s/g, ''));
          const indexes = UserController.getAttributeIndexes(headerRow);
          const promiseArr = [];
          // Start from 1st row and leave headers
          for (let r = 1; r < sheetData.length; r += 1) {
            const row = sheetData[r];
            if (!row.length > 0) {
              // eslint-disable-next-line no-continue
              continue;
            }
            const userData = UserController.getFormattedUserData(row, indexes);
            if (userData.email) {
              promiseArr.push(UserController.createUserBatch(userData));
            } else {
              ingestStatus.failed += 1;
            }
            if (promiseArr.length === 100) {
              // eslint-disable-next-line no-await-in-loop
              const results = await Promise.all(promiseArr.splice(0, 100));
              aggregateResult(results);
            }
          }
          if (promiseArr.length) {
            // eslint-disable-next-line no-await-in-loop
            const results = await Promise.all(promiseArr.splice(0, 100));
            aggregateResult(results);
          }
        }
      }
      // delete uploaded file after processing
      await deleteFileAsync(excelFilePath);
      return SuccessResponse(res, {
        message: `${ingestStatus.success} users created, ${ingestStatus.failed} users failed`,
      });
    } catch (e) {
      next(e);
    }
  }

  static getAttributeIndexes(headerRow) {
    return {
      deptIndex: headerRow.indexOf('Department'),
      titleIndex: headerRow.indexOf('Title'),
      locIndex: headerRow.indexOf('Location'),
      nameIndex: headerRow.indexOf('Name'),
      extIndex: headerRow.indexOf('Extension'),
      cellNoIndex: headerRow.indexOf('CellPhone'),
      emailIndex: headerRow.indexOf('Email'),
      dobIndex: headerRow.indexOf('DOB'),
      joiningDateIndex: headerRow.indexOf('JoiningDate'),
    };
  }

  static getFormattedUserData(row, attributeIndexes) {
    const fullName = row[attributeIndexes.nameIndex];
    let firstName = '';
    let lastName = '';
    if (fullName) {
      const fullNameArr = row[attributeIndexes.nameIndex].replace(/['"]+/g, '').trim().split(' ');
      firstName = fullNameArr.slice(0, 1).join('');
      lastName = fullNameArr.slice(1, fullNameArr.length).join(' ');
    }
    return {
      firstName,
      lastName,
      email: row[attributeIndexes.emailIndex],
      contactNo: row[attributeIndexes.cellNoIndex],
      extension: row[attributeIndexes.extIndex],
      title: row[attributeIndexes.titleIndex],
      department: row[attributeIndexes.deptIndex],
      location: row[attributeIndexes.locIndex],
      dob: row[attributeIndexes.dobIndex]
        ? moment(row[attributeIndexes.dobIndex], 'MM-DD-YYYY')
        : null,
      joiningDate: row[attributeIndexes.joiningDateIndex]
        ? moment(row[attributeIndexes.joiningDateIndex], 'MM-DD-YYYY')
        : null,
    };
  }

  static async createUserBatch(userData) {
    let userInfo = { ...userData };
    const query = {
      where: {
        email: userInfo.email,
      },
    };
    try {
      const userExists = await User.findOne(query);
      if (userExists === null) {
        const locationQuery = {
          where: {
            name: userInfo.location,
          },
        };
        const departmentQuery = {
          where: {
            name: userInfo.department,
          },
        };
        const location = await Location.findOrCreate(locationQuery);
        const department = await Department.findOrCreate(departmentQuery);
        userInfo = {
          ...userInfo,
          departmentId: department[0].id,
          locationId: location[0].id,
          password: generateHash('ftrv@123'),
          role: 'user',
          status: 'active',
        };
        delete userInfo.location;
        delete userInfo.department;
        const user = await User.create(userInfo);
        debug(`User with ${user.email} created successfully`);
        return { status: 'success' };
      }
      debug(`User ${userInfo.email} already exists`);
      return { status: 'failed' };
    } catch (e) {
      debug(e);
      return { status: 'failed' };
    }
  }
}

export default UserController;
