import { PERMISSIONS } from '../../utils/constants';
import models from '../../models';
import { groupQuery } from './query';

const { READ, WRITE } = PERMISSIONS;

const { Resource, GroupPermission, Group } = models;

export const createDemoGroupPermissions = async () => {
  const resources = await Resource.findAll();
  const groups = await Group.findAll(groupQuery);
  const groupPermissions = resources.map((resource) => ({
    groupId: groups[0].id,
    resourceId: resource.id,
    permission: WRITE,
    createdAt: new Date(),
    updatedAt: new Date(),
  }));
  resources.map(({ id }) => {
    const resourceObj = {
      groupId: groups[1].id,
      resourceId: id,
      permission: READ,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    groupPermissions.push(resourceObj);
    return false;
  });
  await GroupPermission.bulkCreate(groupPermissions);
};
