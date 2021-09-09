import sequelize from 'sequelize';
import models from '../../models';
import { makeLikeCondition } from '../../utils/helper';

const { Op } = sequelize;
const { User } = models;

export const listProfitCentersQuery = ({
  sortOrder,
  sortColumn,
  pageNumber,
  pageSize,
  searchString,
}) => {
  const query = { where: {} };
  query.distinct = true;
  query.include = [
    {
      model: User,
      as: 'manager',
      attributes: ['firstName', 'lastName'],
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'userId'],
  };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

  // for filtering
  if (searchString) {
    query.where[Op.or] = [];
    const searchColumns = ['centerName'];
    searchColumns.map((val) => query.where[Op.or].push(makeLikeCondition(val, searchString)));
  }
  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }
  return query;
};
