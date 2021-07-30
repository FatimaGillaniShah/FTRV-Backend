import sequelize from 'sequelize';
import models from '../../models';
import { makeEqualityCondition, makeLikeCondition } from '../../utils/helper';

const { Location, Department, User } = models;
const { Op } = sequelize;

export const getJobByIdQuery = (id) => {
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
    {
      model: User,
      as: 'createdByUser',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'updatedByUser',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
  ];
  query.attributes = {
    exclude: [
      'createdAt',
      'updatedAt',
      'locationId',
      'departmentId',
      'userId',
      'createdBy',
      'updatedBy',
    ],
  };
  return query;
};

export const listJobs = ({
  sortOrder,
  sortColumn,
  pageNumber,
  pageSize,
  searchString,
  title,
  departmentId,
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
    {
      model: User,
      as: 'createdByUser',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'updatedByUser',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
  ];
  query.attributes = {
    exclude: [
      'createdAt',
      'updatedAt',
      'locationId',
      'departmentId',
      'userId',
      'createdBy',
      'updatedBy',
    ],
  };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

  // for filtering
  if (searchString) {
    query.where[Op.or] = [];
    const searchColumns = ['title', 'description'];
    searchColumns.map((val) => query.where[Op.or].push(makeLikeCondition(val, searchString)));
  } else {
    if (title) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeLikeCondition('title', title));
    }
    if (departmentId) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeEqualityCondition('departmentId', departmentId));
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
