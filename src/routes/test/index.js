import express from 'express';
import TestController from './testController';

const router = express.Router();
router.get('/', TestController.print);

export default router;
