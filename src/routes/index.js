import express from 'express';
import acl from 'express-acl';
import auth from '../middlewares/auth';
import UserController from './user/user.controller';
import AnnouncementController from './announcement/announcement.controller';
import UsefulLinkController from './usefulLink/usefulLink.controller';
import QuoteController from './quote/quote.controller';
import EventsController from './events/events.controller';
import CeoController from './ceo/ceo.controller';
import BlogController from './blog/blog.controller';

const router = express.Router();

// list of routes to be excluded from authentication and authorization
const aclExcludedRoutes = ['/api/users/login', /^\/api-docs\/.*/];

acl.config({
  baseUrl: 'api',
  filename: 'acl.json',
  path: 'src/config',
  decodedObjectName: 'user',
});
router.use(auth.required.unless({ path: aclExcludedRoutes }));
router.use(acl.authorize.unless({ path: aclExcludedRoutes }));

router.use('/users', UserController.getRouter());
router.use('/announcements', AnnouncementController.getRouter());
router.use('/usefulLinks', UsefulLinkController.getRouter());
router.use('/quote', QuoteController.getRouter());
router.use('/events', EventsController.getRouter());
router.use('/ceo', CeoController.getRouter());
router.use('/blogs', BlogController.getRouter());

export default router;
