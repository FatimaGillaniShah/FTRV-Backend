import sequelize from 'sequelize';
import models from '../../models';
import { makeLikeCondition } from '../../utils/helper';

const { Op } = sequelize;
const { User } = models;
export const updateProfitCenterQuery = (id) => ({
  where: {
    id,
  },
});
export const getProfileCenterByIdQuery = (id) => {
  const query = {};
  query.where = {
    id,
  };
  query.include = [
    {
      model: User,
      as: 'manager',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'createdByUser',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'updatedByUser',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
  };
  return query;
};

export const listProfitCentersQuery = ({
  sortOrder,
  sortColumn,
  pageNumber,
  pageSize,
  searchString,
  isPagination = false,
}) => {
  const query = { where: {} };
  query.distinct = true;
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'managerId', 'createdBy', 'updatedBy'],
  };

  if (Number(isPagination)) {
    query.offset = (pageNumber - 1) * pageSize;
    query.limit = pageSize;
  }
  query.include = [
    {
      model: User,
      as: 'manager',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'createdByUser',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'updatedByUser',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
  ];

  // for filtering
  if (searchString) {
    query.where[Op.or] = [];
    const searchColumns = ['name', 'address'];
    searchColumns.map((val) => query.where[Op.or].push(makeLikeCondition(val, searchString)));
  }
  // for sorting
  if (sortColumn === 'manager.firstName') {
    query.order = [[{ model: User, as: 'manager' }, 'firstName', sortOrder]];
  } else if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }
  return query;
};

export const deleteProfitCenterQuery = (id) => ({
  where: {
    id,
  },
});
