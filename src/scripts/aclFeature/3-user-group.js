import models from '../../models';
import { ROLES } from '../../utils/constants';
import { groupQuery } from './query';

const SUPER_ADMIN_GROUP = 'Super Admin Group';
const NORMAL_USER_GROUP = 'User Group';

const { UserGroup, User, Group } = models;

export const createUserGroups = async () => {
  await UserGroup.destroy({ truncate: true });
  const users = await User.findAll();
  const groups = await Group.findAll(groupQuery);
  const adminId = groups.find((group) => group.name === SUPER_ADMIN_GROUP)?.id;
  const userId = groups.find((group) => group.name === NORMAL_USER_GROUP)?.id;
  const userGroup = users.map((user) => ({
    userId: user.id,
    groupId: user.role === ROLES.ADMIN ? adminId : userId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  await UserGroup.bulkCreate(userGroup);
};
