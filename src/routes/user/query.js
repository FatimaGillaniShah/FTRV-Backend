import sequelize from 'sequelize';

const { Op } = sequelize;

export const listQuery = ({
  status,
  searchString,
  sortColumn,
  sortOrder,
  pageNumber = 1,
  pageSize,
}) => {
  const query = { where: {} };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

  if (status) {
    query.where[Op.and] = [{ status }];
  }
  // for filtering
  if (searchString) {
    const likeClause = { [Op.like]: parseInt(searchString, 10) > 0 ? `%${searchString}%` : '' };
    query.where[Op.or] = [
      {
        id: likeClause,
      },
      {
        name: likeClause,
      },
      {
        email: likeClause,
      },
    ];
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  return query;
};
