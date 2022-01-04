import sequelize from 'sequelize';
import models from '../../models';
import { makeLikeCondition } from '../../utils/helper';

const { Resource, User, Location, Department, Group } = models;
const { Op } = sequelize;
export const getByNameQuery = (name) => {
  const query = {
    where: {
      name,
    },
  };
  return query;
};

export const listQuery = ({ name }) => {
  const query = {
    attributes: {
      exclude: ['createdBy', 'createdAt', 'updatedBy', 'updatedAt'],
    },
    include: [
      {
        model: Resource,
        as: 'resources',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        through: { as: 'resourcePermission', attributes: ['permission'] },
      },
    ],
  };
  if (name) {
    query.where = [makeLikeCondition('name', name)];
  }
  return query;
};

export const getUsersByGroupIdQuery = (id) => {
  const query = {
    where: {
      groupId: id,
    },
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'id', 'groupId', 'userId'],
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'deletedAt', 'locationId', 'departmentId'],
        },
        include: [
          {
            model: Location,
            as: 'location',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'id'],
            },
          },
          {
            model: Department,
            as: 'department',
            attributes: {
              exclude: ['createdAt', 'updatedAt', 'id'],
            },
          },
          {
            model: Group,
            as: 'groups',
            attributes: {
              exclude: ['createdAt', 'updatedAt'],
            },
            through: { attributes: [] },
          },
        ],
      },
    ],
  };
  return query;
};
export const getGroupByIdQuery = (id) => {
  const query = {
    where: {
      id,
    },
  };
  query.include = [
    {
      model: Resource,
      as: 'resources',
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      through: { as: 'resourcePermission', attributes: ['permission'] },
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt'],
  };
  return query;
};

export const updateGroupQuery = (id) => {
  const query = {
    where: {
      id,
    },
  };
  return query;
};

export const nameExistQuery = (id, name) => {
  const query = {
    where: {
      name,
      id: { [Op.ne]: id },
    },
  };
  return query;
};
export const deleteGroupPermissionsQuery = (groupId) => ({
  where: {
    groupId,
  },
});
