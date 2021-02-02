import express from 'express';
import UserController from './user.controller';

const router = express.Router();
// router.get('/login', UserController.login);
// router.post('/signup', signup);
// router.post('/logout', logout);
// router.post('/update', update);
// router.post('/delete', deleteUser);
// router.get('/getUserById', getUserById);
router.get('/', UserController.list);

export default router;
