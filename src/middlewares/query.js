import models from '../models';

const { Group, Resource } = models;

export const query = (id) => ({
  where: {
    id,
  },
  attributes: ['id'],
  include: [
    {
      model: Group,
      as: 'groups',
      attributes: ['id', 'name'],
      through: { attributes: [] },
      include: [
        {
          model: Resource,
          as: 'resources',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: { as: 'resourcePermission', attributes: ['permission'] },
        },
      ],
    },
  ],
});
