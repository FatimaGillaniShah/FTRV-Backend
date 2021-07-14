import sequelize from 'sequelize';
import models from '../../models';
import { makeEqualityCondition, makeLikeCondition } from '../../utils/helper';

const { Location, Department } = models;
const { Op } = sequelize;

export const getRingGroupByIdQuery = (id) => {
  const query = {};
  query.where = {
    id,
  };
  query.include = [
    {
      model: Location,
      as: 'location',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
    {
      model: Department,
      as: 'department',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'locationId', 'departmentId'],
  };
  return query;
};

export const listQuery = ({
  sortColumn,
  sortOrder,
  pageNumber,
  pageSize,
  searchString,
  name,
  departmentId,
  extension,
  locationId,
}) => {
  const query = { where: {} };
  query.include = [
    {
      model: Location,
      as: 'location',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
    {
      model: Department,
      as: 'department',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'locationId', 'departmentId'],
  };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

  // for filtering
  if (searchString) {
    const likeClause = { [Op.iLike]: `%${searchString}%` };
    query.where[Op.or] = [
      {
        name: likeClause,
      },
      {
        extension: likeClause,
      },
    ];
  } else {
    if (name) {
      query.where[Op.and] = [
        {
          name: {
            [Op.iLike]: `%${name}%`,
          },
        },
      ];
    }
    if (departmentId) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeEqualityCondition('departmentId', departmentId));
    }
    if (extension) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeLikeCondition('extension', extension));
    }
    if (locationId) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeEqualityCondition('locationId', locationId));
    }
  }

  // for sorting
  if (sortColumn === 'location.name') {
    query.order = [[{ model: Location, as: 'location' }, 'name', sortOrder]];
  } else if (sortColumn === 'department.name') {
    query.order = [[{ model: Department, as: 'department' }, 'name', sortOrder]];
  } else if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }
  return query;
};
