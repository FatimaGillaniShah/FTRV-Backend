import Joi from 'joi';
import passport from 'passport';
import path from 'path';
import xlsx from 'node-xlsx';
import debugObj from 'debug';
import moment from 'moment';
import { chain, isEqual } from 'lodash';
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
  getLoggedUserQuery,
  findOrCreateGoogleUserQuery,
  deleteUserGroupQuery,
  listGroups,
  updateUserQuery,
  userExistQuery,
  listTitleQuery,
  getUserByIdWithGroups,
} from './query';

import {
  BadRequestError,
  cleanUnusedFiles,
  flattenPermission,
  generateHash,
  generateJWT,
  generatePreSignedUrlForGetObject,
  getErrorMessages,
  getPassportErrorMessage,
  SuccessResponse,
} from '../../utils/helper';
import {
  userBulkUpdateSchema,
  userLoginSchema,
  userSignUpSchema,
  userUpdateSchema,
} from './validationSchemas';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import GroupController from '../group/group.controller';

const debug = debugObj('api:server');
const deleteFileAsync = promisify(fs.unlink);
const { User, Location, Department, UserGroup, Group } = models;
class UserController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', uploadFile('image').single('file'), this.createUser);
    this.router.get('/birthday', this.birthdays);
    this.router.get('/workAnniversary', this.workAnniversaries);
    this.router.put('/userBulkUpdate', this.updateBulkUsers);
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
        isPagination,
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
        isPagination,
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
      if (!user) {
        BadRequestError(`User does not exist`, STATUS_CODES.NOTFOUND);
      }
      const groups = flattenPermission(user?.groups);
      const userResponse = {
        ...user.toJSON(),
        groups,
      };
      UserController.generatePreSignedUrl([userResponse]);
      return SuccessResponse(res, userResponse);
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

    return passport.authenticate('local', { session: false }, async (err, passportUser, info) => {
      if (err) {
        return next(err);
      }

      if (passportUser) {
        const userInfo = await User.findOne(getLoggedUserQuery(passportUser.id));
        const groups = flattenPermission(userInfo?.groups);
        const userObj = {
          id: passportUser.id,
          email: passportUser.email,
          name: passportUser.fullName,
          avatar: passportUser.avatar,
          isAdmin: passportUser.isAdmin,
          token: generateJWT(passportUser),
          groups,
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
        given_name: firstName,
        family_name: lastName,
        exp,
      } = ticket.getPayload();

      if (Math.floor(Date.now() / 1000) > exp) {
        BadRequestError('Token expired. Try again', 400);
      }
      const [user] = await User.findOrCreate(
        findOrCreateGoogleUserQuery({ email, avatar, firstName, lastName })
      );
      const userInfo = await User.findOne(getLoggedUserQuery(user.id));
      const groups = flattenPermission(userInfo?.groups);
      const userObj = {
        id: user.id,
        email,
        name: user.fullName,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: generateJWT(user),
        groups,
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
      if (!userPayload?.dob) {
        userPayload.dob = null;
      }
      if (!userPayload?.joiningDate) {
        userPayload.joiningDate = null;
      }
      const query = {
        where: {
          email: userPayload.email,
        },
      };

      const userExists = await User.findOne(query);
      if (!userExists) {
        userPayload.password = generateHash(userPayload.password);
        userPayload.status = 'active';
        userPayload.avatar = file.key;
        const user = await User.create(userPayload);
        const userResponse = user.toJSON();
        const userGroups = UserController.createUserGroup(userResponse.id, userPayload.groupIds);
        await Promise.all(userGroups || []);
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
      const payloadGroupIds = userPayload?.groupIds.map(Number);
      const result = Joi.validate(userPayload, userUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      if (!userPayload?.dob) {
        userPayload.dob = null;
      }
      if (!userPayload?.joiningDate) {
        userPayload.joiningDate = null;
      }

      const userExists = await User.findOne(getUserByIdWithGroups({ id: userId }));
      if (userExists) {
        if (userPayload.password) {
          userPayload.password = generateHash(userPayload.password);
        }
        if (userPayload.file === '') {
          userPayload.avatar = '';
        } else {
          userPayload.avatar = file.key || userExists.avatar;
        }
        await User.update(userPayload, updateUserQuery(userId));
        await UserGroup.destroy(deleteUserGroupQuery(userId));
        const userGroups = UserController.createUserGroup(userId, payloadGroupIds);
        await Promise.all(userGroups || []);
        delete userPayload.password;
        if (id === parseInt(userId, 10)) {
          UserController.generatePreSignedUrl([userPayload]);
        }
        const existingGroupIds = userExists.groups.map(({ id: groupId }) => groupId);
        if (payloadGroupIds?.length > 0 && !isEqual(existingGroupIds, payloadGroupIds)) {
          await GroupController.sendMessageToRelatedUsers(payloadGroupIds);
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

  @RequestBodyValidator(userBulkUpdateSchema)
  @Request
  static async updateBulkUsers(req, res) {
    const { body: bulkUpdatePayload } = req;
    const { userIds, groupId, ...updateUserPayload } = bulkUpdatePayload;
    const userExists = await User.findAll(userExistQuery(userIds));
    if (userExists.length <= 0) {
      BadRequestError(`User(s) does not exist`, STATUS_CODES.NOTFOUND);
    }
    if (userExists.length !== userIds.length) {
      BadRequestError(`One or more user does not exist`, STATUS_CODES.NOTFOUND);
    }
    const users = UserController.bulkUserUpdate(userIds, updateUserPayload);
    await Promise.all(users);
    if (groupId?.length > 0) {
      await UserGroup.destroy(deleteUserGroupQuery(userIds));
      let userGroups;
      // eslint-disable-next-line array-callback-return
      userIds.map((userId) => {
        userGroups = UserController.createUserGroup(userId, groupId);
      });
      await Promise.all(userGroups || []);
      await GroupController.sendMessageToRelatedUsers(groupId);
    }

    return SuccessResponse(res, bulkUpdatePayload);
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
      const userKeyobjects = chain(users)
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
            // eslint-disable-next-line no-await-in-loop
            const userData = await UserController.getFormattedUserData(row, indexes);
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
      groupIndex: headerRow.indexOf('Group'),
    };
  }

  static async getFormattedUserData(row, attributeIndexes) {
    const fullName = row[attributeIndexes.nameIndex];
    let firstName = '';
    let lastName = '';
    if (fullName) {
      const fullNameArr = row[attributeIndexes.nameIndex].replace(/['"]+/g, '').trim().split(' ');
      firstName = fullNameArr.slice(0, 1).join('');
      lastName = fullNameArr.slice(1, fullNameArr.length).join(' ');
    }
    const groupName = row[attributeIndexes.groupIndex] || '';
    let groupNames = groupName.trim().split('|');
    groupNames = groupNames?.map((name) => name.trim());

    const groups = await Group.findAll(listGroups(groupNames));
    const groupIds = groups?.map((group) => group.id);
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
      groupIds,
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
          status: 'active',
        };
        delete userInfo.location;
        delete userInfo.department;
        const user = await User.create(userInfo);
        debug(`User with ${user.email} created successfully`);
        const userGroup = UserController.createUserGroup(user.id, userInfo.groupIds);
        await Promise.all(userGroup);
        debug(
          `User Group with groupIds ${
            userInfo?.groupIds.length > 0
              ? `${userInfo?.groupIds} created successfully`
              : 'failed because groupIds is undefined'
          } `
        );

        return { status: 'success' };
      }
      debug(`User ${userInfo.email} already exists`);
      return { status: 'failed' };
    } catch (e) {
      debug(e);
      return { status: 'failed' };
    }
  }

  static createUserGroup(userId, groupIds) {
    return groupIds?.map((groupId) => {
      const userGroupCreateParams = {
        userId,
        groupId,
      };
      return UserGroup.create(userGroupCreateParams);
    });
  }

  static bulkUserUpdate(userIds, { locationId, departmentId }) {
    return userIds?.map((userId) => {
      const userUpdateParams = {
        locationId,
        departmentId,
      };
      return User.update(userUpdateParams, updateUserQuery(userId));
    });
  }
}

export default UserController;
