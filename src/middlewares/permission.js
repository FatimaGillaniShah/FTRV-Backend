import debugObj from 'debug';
import { aclExcludedRoutes, permissionExcludedRoutes } from '../routes';
import { ACTIONS, OWN_ACTIONS, STATUS_CODES } from '../utils/constants';
import { BadRequestError } from '../utils/helper';
import { checkPermission } from './funtions';

const debug = debugObj('api:permissions');

export const handlePermissions = async (req, res, next) => {
  const excludedArray = [...permissionExcludedRoutes, ...aclExcludedRoutes];
  if (excludedArray.includes(req.originalUrl)) {
    next();
    return;
  }
  const {
    user: { groups, isAdmin, id },
    url,
    method,
  } = req;
  try {
    if (isAdmin) {
      return next();
    }
    const nestedRoutes = ['birthday', 'workAnniversary'];
    const urlArray = url.split(/[?/]/);
    const isRouteNested = nestedRoutes.some((route) => urlArray.includes(route));
    nestedRoutes.some((route) => urlArray.includes(route));
    // eslint-disable-next-line no-unused-vars
    const [emptyString, urlString, nestedReqUrl] = urlArray;
    const reqUrl = isRouteNested ? nestedReqUrl : urlString;
    const isUserProfile =
      reqUrl === 'users' && Number(urlArray[2]) === id && (method === 'PUT' || method === 'GET');
    if (groups.length === 0) {
      debug(`You don't have any groups.`);
    }
    const { defaulPermission, permission, resourceSlug } = checkPermission({
      reqUrl,
      id,
      method,
      groups,
      isUserProfile,
    });
    if (defaulPermission) {
      debug(
        `${ACTIONS[method]} default Resource permission granted on slug: ${resourceSlug} url: ${reqUrl}`
      );
      return next();
    }
    if (!permission.granted) {
      debug(
        `${
          isUserProfile ? OWN_ACTIONS[method] : ACTIONS[method]
        } ${isUserProfile} permission denied on slug: ${resourceSlug} url: ${reqUrl}`
      );
      return BadRequestError(`You are not allowed to perform this action`, STATUS_CODES.FORBIDDEN);
    }
    debug(
      `${
        isUserProfile ? OWN_ACTIONS[method] : ACTIONS[method]
      } permission granted on slug: ${resourceSlug} url: ${reqUrl}`
    );
    return next();
  } catch (error) {
    next(error);
  }
};
