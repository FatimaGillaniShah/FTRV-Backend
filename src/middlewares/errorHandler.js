import { GeneralError } from '../error';
import { STATUS_CODES } from '../utils/constants';

const DEPARTMENT = 'Department does not exist';
const LOCATION = 'Location does not exist';
const MULTIPLE_LOCATION = 'One or more location(s) does not exist';
const MULTIPLE_GROUP = 'One or more Group(s) does not exist';

const ERROR_MESSAGE = {
  Users_locationId_fkey: LOCATION,
  Users_departmentId_fkey: DEPARTMENT,
  UserGroups_groupId_fkey: MULTIPLE_GROUP,
  EventLocations_locationId_fkey: MULTIPLE_LOCATION,
  Jobs_departmentId_fkey: DEPARTMENT,
  Jobs_locationId_fkey: LOCATION,
  Documents_departmentId_fkey: DEPARTMENT,
};

// eslint-disable-next-line no-unused-vars
const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      status: 'error',
      message: err.message,
      data: err.data,
    });
  }
  // Handling error thrown by jwt
  if (err.name === 'UnauthorizedError') {
    return res.status(STATUS_CODES.UNAUTHORIZED).json({
      status: 'error',
      message: err.message,
    });
  }

  // Foriegn key violation Error
  if (err.original.code === STATUS_CODES.FORIEGN_KEY_VIOLATION) {
    return res.status(STATUS_CODES.NOTFOUND).json({
      status: 'error',
      message: ERROR_MESSAGE[err.original.constraint],
    });
  }

  return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: err.message,
  });
};

export default handleErrors;
