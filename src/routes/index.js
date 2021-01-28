import express from 'express';
import acl from 'express-acl';
import auth from '../middlewares/auth';
import users from './api/users';
import test from './test';

const router = express.Router();

// list of routes to be excluded from authentication and authorization
const aclExcludedRoutes = ['/api/users/login', /^\/api-docs\/.*/];

acl.config({
  baseUrl: 'api',
  filename: 'acl.json',
  path: 'src/config',
  defaultRole: 'user',
  decodedObjectName: 'payload',
});
router.use(auth.required.unless({ path: aclExcludedRoutes }));

// for handling unauthorized access
// @TODO Error handling middleware needs to be moved to generic place and more comprehensive
router.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('Invalid Token');
  } else {
    next(err);
  }
});
router.use(acl.authorize.unless({ path: aclExcludedRoutes }));
router.use('/users', users);
router.use('/test', test);

export { router };
