import Joi from 'joi';
import passport from 'passport';
import models from '../../models';
import { PAGE_SIZE } from '../../utils/constants';
import { listQuery } from './query';
import {
  BadRequestError,
  generateHash,
  generateJWT,
  getErrorMessages,
  SuccessResponse,
} from '../../utils/helper';
import { userLoginSchema, userSignUpSchema } from './validationSchemas';

const { User } = models;
const wrapper = (fn) => (...args) => fn(...args).catch(args[2]);
class UserController {
  static router;

  static getRouter(router) {
    this.router = router;
    this.router.get('/', wrapper(this.list));
    this.router.post('/', this.createUser);
    this.router.post('/login', this.login);
    return this.router;
  }

  static async list(req, res, next) {
    const {
      query: { status, searchString, sortColumn, sortOrder, pageNumber = 1, pageSize = PAGE_SIZE },
    } = req;

    if (pageNumber <= 0) {
      BadRequestError('Invalid page number', 422);
    }

    const query = listQuery({ status, searchString, sortColumn, sortOrder, pageNumber, pageSize });
    try {
      const users = await User.findAndCountAll(query);
      SuccessResponse(res, users);
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    const { body: user } = req;

    const result = Joi.validate(user, userLoginSchema, { abortEarly: true });
    if (result.error) {
      return res.status(400).json({
        errors: getErrorMessages(result),
      });
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
          name: passportUser.name,
          token: generateJWT(passportUser),
        };

        return res.json(userObj);
      }

      return res.status(400).send(info);
    })(req, res, next);
  }

  static async createUser(req, res) {
    const { body: userPayload } = req;
    const result = Joi.validate(userPayload, userSignUpSchema);
    if (result.error) {
      return res.status(422).json({
        errors: result.error,
      });
    }
    const query = {
      where: {
        email: userPayload.email,
      },
    };
    try {
      const userExists = await User.findOne(query);
      if (userExists === null) {
        userPayload.password = generateHash(userPayload.password);
        userPayload.role = 'user';
        const user = await User.create(userPayload);
        const userResponse = user.toJSON();
        delete userResponse.password;
        return res.json(userResponse);
      }
      return res.status(400).json(`User "${userPayload.email}" already exists`);
    } catch (e) {
      return res.status(500).json({
        errors: e,
      });
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
