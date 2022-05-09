export const PAGE_SIZE = 10;
export const UPLOAD_PATH = '../public/uploads/';
export const STATUS_CODES = {
  INVALID_INPUT: 422,
  FORBIDDEN: 403,
  NOTFOUND: 404,
  UNAUTHORIZED: 401,
  INTERNAL_SERVER_ERROR: 500,
  FORIEGN_KEY_VIOLATION: '23503',
};

export const TYPES = {
  undefined,
  null: null,
};
export const AWS_CONFIG = {
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY,
  BUCKET: `ftrv-upload-storage-${process.env.NODE_ENV}`,
  PROFILE_PICTURE: [process.env.FOLDER_ALIAS, 'profile-picture'].join('-'),
  BLOG_THUMBNAIL: [process.env.FOLDER_ALIAS, 'blog-thumbnail'].join('-'),
  DOCUMENT_FILE: [process.env.FOLDER_ALIAS, 'document-file'].join('-'),
  APPLICANT_RESUME: [process.env.FOLDER_ALIAS, 'applicant-resume'].join('-'),
  CEO_PAGE: [process.env.FOLDER_ALIAS, 'ceo-page'].join('-'),
  BANNER_IMAGE: [process.env.FOLDER_ALIAS, 'banner-image'].join('-'),
};

export const PERMISSIONS = {
  READ: ['read'],
  WRITE: ['read', 'write'],
};
export const APPLICANT_ACTIONS = {
  GET: 'createAny',
  PUT: 'readAny',
};
export const ACTIONS = {
  GET: 'readAny',
  POST: 'createAny',
  PUT: 'updateAny',
  PATCH: 'updateAny',
  DELETE: 'deleteAny',
};
export const OWN_ACTIONS = {
  GET: 'readOwn',
  PUT: 'updateOwn',
  PATCH: 'updateOwn',
  DELETE: 'deleteOwn',
};
export const APPLICANT = {
  name: 'Applicant',
  slug: 'APPLICANT',
  description: 'Users have access to makes a formal application for job vacancy.',
  url: '/jobApplicant',
};

export const FEATURES = [
  {
    name: 'Directory',
    slug: 'DIRECTORY',
    description:
      'All employee contact information is available including name, job title and phone numbers, making finding employees information easy and accessible in one single place.',
    url: '/users',
  },
  {
    name: 'Message from ceo',
    slug: 'MESSAGE_FROM_CEO',
    description:
      'Provides a message from the CEO regarding company vision, mission statement and goals.',
    url: '/ceo',
  },
  {
    name: 'Profit center',
    slug: 'PROFIT_CENTER',
    description:
      'This feature have a collection of centers based on locations and details of the users that manage them.',
    url: '/profitCenter',
  },
  {
    name: 'Blog',
    slug: 'BLOG',
    description:
      'This feature keeps user up-to-date on discussion or informational about the company, products.',
    url: '/blogs',
  },
  {
    name: 'Career',
    slug: 'CAREER',
    description:
      'Employees can apply for open positions in the company and fulfill their ambitions.This feature helps company to simply finding the qualified person for the job internally instead of hiring new staff externally.',
    url: '/jobs',
  },
  APPLICANT,
  {
    name: 'File storage',
    slug: 'FILE_STORAGE',
    description:
      'Provides a convenient way to store the documents on the Intranet. This feature make it easy for for employees to create, share, edit, and delete documents within organization. ',
    url: '/documents',
  },
  {
    name: 'Links',
    slug: 'LINKS',
    description:
      'A collection of links to organization-related information and services on the internet.',
    url: '/linkCategories',
  },
  {
    name: 'Useful links',
    slug: 'USEFUL_LINKS',
    description:
      'A collection of links to organization-related information and services on the internet.',
    url: '/usefulLinks',
  },
  {
    name: 'Group',
    slug: 'GROUP',
    description:
      'This feature will be able to create groups and select what rights and features shall be available to a certain group. These groups will then be associated with user to visibility and access to the features configured in the group.',
    url: '/groups',
  },
  {
    name: 'Resources',
    slug: 'RESOURCES',
    description:
      'This feature have a collection of all features in Intranet portal. All the user have access to view the resources by default.',
    url: '/resources',
  },
  {
    name: 'Department',
    slug: 'DEPARTMENT',
    description: 'Users shall able to see all the departments with all relevant details.',
    url: '/departments',
  },
  {
    name: 'Location',
    slug: 'LOCATION',
    description: 'Users shall able to see all the FTRV locations with all relevant details.',
    url: '/locations',
  },
  {
    name: 'Announcement',
    slug: 'ANNOUNCEMENT',
    description:
      'This feature keeps users up-to-date on company announcements, important news, and anything that might normally receive through regular company email. ',
    url: '/announcements',
  },
  {
    name: 'Banner image',
    slug: 'BANNER_IMAGE',
    description: 'Display a big picture that user see when opening up a portal.',
    url: '/bannerImage',
  },
  {
    name: 'Work anniversary',
    slug: 'WORK_ANNIVERSARY',
    description: 'A annual annocument that marks an employee"s first day on the job',
    url: '/workAnniversary',
  },
  {
    name: 'Birthday',
    slug: 'BIRTHDAY',
    description: 'A annual annocument that marks an employee"s birthdays',
    url: '/birthday',
  },
  {
    name: 'Quote',
    slug: 'QUOTE',
    description:
      'This feature helps company to boost morale and motivate the employees by writing a quote for them.',
    url: '/quote',
  },
  {
    name: 'Polls',
    slug: 'POLLS',
    description:
      'A poll is designed as a collaborative tool to increase employee engagement, productivity and efficiency.Company start a poll to understanding of what employees want, involve more employees in conversations or leverage a poll to generate content.',
    url: '/polls',
  },
  {
    name: 'Vote',
    slug: 'VOTE',
    description: 'It allows you to vote on Poll',
    url: '/vote',
  },
  {
    name: 'Events',
    slug: 'EVENTS',
    description:
      'With a company calendar, User can post important upcoming events. These can be important meetings, quarterly reviews, holidays, and fun events. This feature upload events to the calendar and share them with users',
    url: '/events',
  },
  {
    name: 'Ring group',
    slug: 'RING_GROUP',
    description: 'Have group of all the employees based on the the locations and departments.',
    url: '/ringGroups',
  },
  {
    name: 'Education',
    slug: 'EDUCATION',
    description:
      'Provide training and tutorials to employees. This features cantains tutorials across topics to help employees walk through a process step by step.',
    url: '/education',
  },
];
export const defaultPermissions = [
  { slug: 'DIRECTORY', url: 'users' },
  { slug: 'BANNER_IMAGE', url: 'bannerImage' },
];
export const defaultGroup = 'defaultPermissions';

export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const MAX_MULTER_FILE_SIZE = process.env.MULTER_FILE_SIZE_LIMIT * 1024 * 1024; // 10MB

export const MAX_MULTER_FIELD_SIZE = process.env.MULTER_FIELD_SIZE_LIMIT * 1024 * 1024; // MB

export const MAX_BODY_SIZE = process.env.BODY_SIZE_LIMIT * 1024 * 1024; // MB
