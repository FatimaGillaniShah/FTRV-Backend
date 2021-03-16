import Joi from 'joi';
import passport from 'passport';
import path from 'path';
import xlsx from 'node-xlsx';
import debugObj from 'debug';
import fs from 'fs';
import { promisify } from 'util';
import express from 'express';
import models from '../../models';
import uploadFile from '../../middlewares/upload';
import { PAGE_SIZE, UPLOAD_PATH } from '../../utils/constants';
import { BadRequest } from '../../error';
import { listQuery } from './query';
import {
  BadRequestError,
  generateHash,
  generateJWT,
  getErrorMessages,
  getPassportErrorMessage,
  SuccessResponse,
} from '../../utils/helper';
import { userLoginSchema, userSignUpSchema, userUpdateSchema } from './validationSchemas';

const debug = debugObj('api:server');
const deleteFileAsync = promisify(fs.unlink);
const { User } = models;
class UserController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', uploadFile('image').single('file'), this.createUser);
    this.router.put('/:id', uploadFile('image').single('file'), this.updateUser);
    this.router.get('/:id', this.getUserById);
    this.router.post('/login', this.login);
    this.router.delete('/deleteUsers', this.deleteUsers);
    this.router.post('/upload', uploadFile('excel').single('file'), this.upload);
    return this.router;
  }

  static async list(req, res, next) {
    const {
      query: {
        status,
        searchString,
        name,
        department,
        title,
        extension,
        location,
        sortColumn,
        sortOrder,
        pageNumber = 1,
        pageSize = PAGE_SIZE,
      },
    } = req;
    try {
      if (pageNumber <= 0) {
        BadRequestError('Invalid page number', 422);
      }

      const query = listQuery({
        status,
        searchString,
        name,
        department,
        title,
        extension,
        location,
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
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
        BadRequestError(`User id is required`, 422);
      }
      const user = await User.findOne({
        where: {
          id,
        },
        attributes: {
          exclude: ['id', 'fullName', 'password', 'createdAt', 'updatedAt', 'deletedAt'],
        },
      });
      return SuccessResponse(res, user);
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    const { body: user } = req;

    const result = Joi.validate(user, userLoginSchema, { abortEarly: true });
    if (result.error) {
      return next(new BadRequest(getErrorMessages(result), 422));
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

        return SuccessResponse(res, userObj);
      }
      return next(new BadRequest(getPassportErrorMessage(info), 422));
    })(req, res, next);
  }

  static async createUser(req, res, next) {
    const { body: userPayload, file = {} } = req;
    try {
      const result = Joi.validate(userPayload, userSignUpSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), 422);
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
        userPayload.avatar = file.filename;
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
    } = req;
    try {
      const result = Joi.validate(userPayload, userUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), 422);
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
        userPayload.avatar = file.filename;
        await User.update(userPayload, query);
        delete userPayload.password;
        return SuccessResponse(res, userPayload);
      }
      BadRequestError(`User does not exists`, 404);
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
        BadRequestError(`User ids required`, 422);
      }
      const user = await User.destroy({
        where: {
          id: ids,
        },
        force: true,
      });
      return SuccessResponse(res, { count: user });
    } catch (e) {
      next(e);
    }
  }

  static async upload(req, res, next) {
    try {
      if (req.file === undefined) {
        BadRequestError('No file found.', 422);
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
            BadRequestError('No row found.', 422);
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
    };
  }

  static async createUserBatch(userData) {
    const query = {
      where: {
        email: userData.email,
      },
    };
    try {
      const userExists = await User.findOne(query);
      if (userExists === null) {
        // eslint-disable-next-line no-param-reassign
        userData.password = generateHash('ftrv@123');
        // eslint-disable-next-line no-param-reassign
        userData.role = 'user';
        // eslint-disable-next-line no-param-reassign
        userData.status = 'active';
        const user = await User.create(userData);
        debug(`User with ${user.email} created successfully`);
        return { status: 'success' };
      }
      debug(`User ${userData.email} already exists`);
      return { status: 'failed' };
    } catch (e) {
      debug(e);
      return { status: 'failed' };
    }
  }
}

//
// const userUpdateSchema = Joi.object().keys({
//   id: Joi.number().min(1).required(),
//   name: Joi.string().min(2).max(100).required(),
//   email: Joi.string().email({ minDomainAtoms: 2 }).required(),
//   password: Joi.string().required(),
//   contactNo: Joi.string().alphanum().required(),
//   roleId: Joi.number().min(1).required(),
//   // values: Joi.array().items(Joi.number()).required(),
// });
//
//
//

// // eslint-disable-next-line no-empty-function,no-unused-vars
// async function logout(req, res /* , next */) {}
//
// // update user
// async function update(req, res /* , next */) {
//   const {
//     body: { user: userUpdateParams },
//   } = req;
//   const result = Joi.validate(userUpdateParams, userUpdateSchema);
//   if (result.error) {
//     return res.status(422).json({
//       errors: result.error,
//     });
//   }
//   const query = {
//     where: {
//       email: userUpdateParams.email,
//       id: { [Op.notIn]: [userUpdateParams.id] },
//     },
//   };
//
//   try {
//     const userExists = await User.findOne(query);
//     if (userExists) {
//       userUpdateParams.password = await generateHash(userUpdateParams.password);
//       const user = await User.update(
//         _.pick(userUpdateParams, ['name', 'email', 'contactNo', 'roleId', 'password']),
//         {
//           where: {
//             id: userUpdateParams.id,
//           },
//         }
//       );
//       return res.json({ user });
//     }
//     return res.status(404).json('User not found');
//   } catch (e) {
//     return res.status(500).json({
//       errors: e,
//     });
//   }
// }
//
// // delete User
// async function deleteUser(req, res /* , next */) {
//   const {
//     body: { id },
//   } = req;
//   if (_.isEmpty(id)) {
//     return res.status(422).json({
//       errors: 'User id is required',
//     });
//   }
//
//   try {
//     const user = await User.destroy({
//       where: {
//         id,
//       },
//     });
//     return res.json({ user });
//   } catch (e) {
//     return res.status(500).json({
//       errors: e,
//     });
//   }
// }
//
// // get user by ID
// async function getUserById(req, res) {
//   const {
//     query: { id },
//   } = req;
//
//   if (_.isEmpty(id)) {
//     return res.status(422).json({
//       errors: 'User id is required',
//     });
//   }
//
//   try {
//     const user = await User.findOne({ where: { id } });
//     return res.status(200).json({
//       user,
//     });
//   } catch (e) {
//     return res.status(500).json({
//       errors: e,
//     });
//   }
// }
//
//
// // get user roles
// async function role(req, res /* , next */) {
//   const { Role } = models;
//   try {
//     const query = {
//       attributes: ['id', 'name'],
//       where: {},
//     };
//     const roleObj = await Role.findAll(query);
//     return res.status(200).json({
//       roleObj,
//     });
//   } catch (e) {
//     return res.status(500).json({
//       errors: e,
//     });
//   }
// }

export default UserController;
