import models from '../../models';

const { Group } = models;
const DEMO_GROUPS = [
  {
    name: 'Super Admin Group',
    description: '',
    createdBy: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'User Group',
    createdBy: 1,
    description: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const createDemoGroups = async () => {
  await Group.bulkCreate(DEMO_GROUPS);
};
