import sequelize from 'sequelize';

const { Op } = sequelize;

export const listQuery = ({ status, sortColumn, sortOrder, pageNumber, pageSize }) => {
  const query = { where: {} };
  query.attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

  if (status) {
    query.where[Op.and] = [{ status }];
  }

  // for pagination
  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  query.order = [['startTime', 'ASC']];

  return query;
};
