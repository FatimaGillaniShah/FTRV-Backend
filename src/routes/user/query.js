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
  query.attributes = { exclude: ['password'] };
  if (status) {
    query.where[Op.and] = [{ status }];
  }
  // for filtering
  if (searchString) {
    const likeClause = { [Op.like]: `%${searchString}%` };
    query.where[Op.or] = [
      {
        firstName: likeClause,
      },
      {
        lastName: likeClause,
      },
      {
        email: likeClause,
      },
    ];
    const integerValue = parseInt(searchString, 10);
    if (integerValue > 0) {
      query.where[Op.or].push({
        id: integerValue,
      });
    }
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  return query;
};
