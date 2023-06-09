import express from 'express';
import auth from '../middlewares/auth';
import UserController from './user/user.controller';
import AnnouncementController from './announcement/announcement.controller';
import UsefulLinkController from './usefulLink/usefulLink.controller';
import QuoteController from './quote/quote.controller';
import EventsController from './events/events.controller';
import CeoController from './ceo/ceo.controller';
import BlogController from './blog/blog.controller';
import LinkCategoryController from './linkCategory/linkCategory.controller';
import LocationController from './location/location.controller';
import BannerImageController from './bannerImage/bannerImage.controller';
import DepartmentController from './department/department.controller';
import DocumentController from './document/document.controller';
import RingGroupController from './ringGroup/ringGroup.controller';
import JobController from './job/job.controller';
import JobApplicantController from './jobApplicant/jobApplicant.controller';
import PollController from './poll/poll.controller';
import ProfitCenterController from './profitCenter/profitCenter.controller';
import GroupController from './group/group.controller';
import ResourceController from './resource/resource.controller';
import { handlePermissions } from '../middlewares/permission';
import { extentUser } from '../middlewares/extendUser';
import VoteController from './vote/vote.controller';
import WebSocketController from './webSocket/webSocket.controller';

const router = express.Router();

// list of routes to be excluded from authentication and authorization
export const aclExcludedRoutes = [
  '/api/users/googleLogin',
  '/api/users/login',
  '/api/webSocket',
  /^\/api-docs\/.*/,
];
export const permissionExcludedRoutes = ['/api/jobApplicant'];

router.use(auth.required.unless({ path: aclExcludedRoutes }));
router.use(extentUser);

router.use(handlePermissions);

router.use('/users', UserController.getRouter());
router.use('/announcements', AnnouncementController.getRouter());
router.use('/usefulLinks', UsefulLinkController.getRouter());
router.use('/quote', QuoteController.getRouter());
router.use('/events', EventsController.getRouter());
router.use('/ceo', CeoController.getRouter());
router.use('/blogs', BlogController.getRouter());
router.use('/linkCategories', LinkCategoryController.getRouter());
router.use('/locations', LocationController.getRouter());
router.use('/bannerImage', BannerImageController.getRouter());
router.use('/departments', DepartmentController.getRouter());
router.use('/documents', DocumentController.getRouter());
router.use('/ringGroups', RingGroupController.getRouter());
router.use('/jobs', JobController.getRouter());
router.use('/jobApplicant', JobApplicantController.getRouter());
router.use('/polls', PollController.getRouter());
router.use('/profitCenter', ProfitCenterController.getRouter());
router.use('/groups', GroupController.getRouter());
router.use('/resources', ResourceController.getRouter());
router.use('/vote', VoteController.getRouter());
router.use('/webSocket', WebSocketController.getRouter());

export default router;
