import sequelize from 'sequelize';
import Joi from 'joi';
import passport from 'passport';
import express from 'express';
import _ from 'lodash';
import { generateHash } from '../../utils/passwordUtil';
import generateJWT from '../../utils/generateJWT';
import models from '../../models';

const router = express.Router();
const { User } = models;

const { Op } = sequelize;

const userSignUpSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().required(),
  name: Joi.string().min(2).max(100).required(),
  contactNo: Joi.string().alphanum().required(),
  roleId: Joi.number().min(1).required(),
  // values: Joi.array().items(Joi.number()).required()
});

const userLoginSchema = Joi.object().keys({
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().required(),
});

const userUpdateSchema = Joi.object().keys({
  id: Joi.number().min(1).required(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email({ minDomainAtoms: 2 }).required(),
  password: Joi.string().required(),
  contactNo: Joi.string().alphanum().required(),
  roleId: Joi.number().min(1).required(),
  // values: Joi.array().items(Joi.number()).required(),
});

// users routes
router.get('/login', login);
router.post('/signup', signup);
router.post('/logout', logout);
router.post('/update', update);
router.post('/delete', deleteUser);
router.get('/getUserById', getUserById);
router.get('/list', list);
router.get('/role', role);

function login(req, res, next) {
  const {
    body: { user },
  } = req;
  const result = Joi.validate(user, userLoginSchema);
  if (result.error) {
    return res.status(422).json({
      errors: result.error,
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
        name: passportUser.name,
        token: generateJWT(passportUser),
      };

      return res.json({ userObj });
    }

    return res.status(400).send(info);
  })(req, res, next);
}

async function signup(req, res /* , next */) {
  const {
    body: { user: userParams },
  } = req;
  const result = Joi.validate(userParams, userSignUpSchema);
  if (result.error) {
    return res.status(422).json({
      errors: result.error,
    });
  }
  const query = {
    where: {
      email: userParams.email,
    },
  };
  try {
    const userExists = await User.findOne(query);
    if (userExists === null) {
      userParams.password = generateHash(userParams.password);
      const user = await User.create(userParams);
      return res.json({ user });
    }
    return res.status(404).json(`User "${userParams.email}" already exists`);
  } catch (e) {
    return res.status(500).json({
      errors: e,
    });
  }
}

// eslint-disable-next-line no-empty-function,no-unused-vars
async function logout(req, res /* , next */) {}

// update user
async function update(req, res /* , next */) {
  const {
    body: { user: userUpdateParams },
  } = req;
  const result = Joi.validate(userUpdateParams, userUpdateSchema);
  if (result.error) {
    return res.status(422).json({
      errors: result.error,
    });
  }
  const query = {
    where: {
      email: userUpdateParams.email,
      id: { [Op.notIn]: [userUpdateParams.id] },
    },
  };

  try {
    const userExists = await User.findOne(query);
    if (userExists) {
      userUpdateParams.password = await generateHash(userUpdateParams.password);
      const user = await User.update(
        _.pick(userUpdateParams, ['name', 'email', 'contactNo', 'roleId', 'password']),
        {
          where: {
            id: userUpdateParams.id,
          },
        }
      );
      return res.json({ user });
    }
    return res.status(404).json('User not found');
  } catch (e) {
    return res.status(500).json({
      errors: e,
    });
  }
}

// delete User
async function deleteUser(req, res /* , next */) {
  const {
    body: { id },
  } = req;
  if (_.isEmpty(id)) {
    return res.status(422).json({
      errors: 'User id is required',
    });
  }

  try {
    const user = await User.destroy({
      where: {
        id,
      },
    });
    return res.json({ user });
  } catch (e) {
    return res.status(500).json({
      errors: e,
    });
  }
}

// get user by ID
async function getUserById(req, res) {
  const {
    query: { id },
  } = req;

  if (_.isEmpty(id)) {
    return res.status(422).json({
      errors: 'User id is required',
    });
  }

  try {
    const user = await User.findOne({ where: { id } });
    return res.status(200).json({
      user,
    });
  } catch (e) {
    return res.status(500).json({
      errors: e,
    });
  }
}

// GET Users list
async function list(req, res /* , next */) {
  const {
    query: { searchString, sortColumn, sortOrder },
  } = req;

  const query = { where: {} };

  // for pagination
  const pageNo = parseInt(req.query.pageNo, 10);
  const pageSize = parseInt(req.query.pageSize, 10);

  if (pageNo < 0 || pageNo === 0) {
    const error = 'Invalid page number';
    return res.status(422).json({
      error,
    });
  }

  query.offset = (pageNo - 1) * pageSize;
  query.limit = pageSize;

  // for filtering
  if (searchString) {
    query.where[Op.or] = [
      {
        id: {
          [Op.like]: parseInt(searchString, 10) > 0 ? `%${searchString}%` : '',
        },
      },
      {
        name: {
          [Op.like]: `%${searchString}%`,
        },
      },
    ];
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  try {
    const users = await User.findAndCountAll(query);
    return res.status(200).json({
      users,
    });
  } catch (e) {
    return res.status(500).json({
      errors: e,
    });
  }
}

// get user roles
async function role(req, res /* , next */) {
  const { Role } = models;
  try {
    const query = {
      attributes: ['id', 'name'],
      where: {},
    };
    const roleObj = await Role.findAll(query);
    return res.status(200).json({
      roleObj,
    });
  } catch (e) {
    return res.status(500).json({
      errors: e,
    });
  }
}

export default router;
