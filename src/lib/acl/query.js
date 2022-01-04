import models from '../../models';

const { Resource } = models;

export const query = () => ({
  include: [
    {
      model: Resource,
      as: 'resources',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      through: { as: 'resourcePermission', attributes: ['permission'] },
    },
  ],
});
