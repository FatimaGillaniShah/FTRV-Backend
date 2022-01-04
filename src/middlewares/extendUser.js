import models from '../models';
import { flattenPermission } from '../utils/helper';
import { query } from './query';

const { User } = models;

export const extentUser = async (req, res, next) => {
  const { user } = req;
  try {
    if (user?.id) {
      const { groups } = await User.findOne(query(user?.id));
      const userGroups = flattenPermission(groups);
      req.user = { ...req.user, groups: userGroups };
    }
    next();
  } catch (error) {
    next(error);
  }
};
