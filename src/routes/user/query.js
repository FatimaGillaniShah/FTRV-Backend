import sequelize from 'sequelize';

const { Op } = sequelize;

const makeSearchCondition = (columnName, searchValue) => {
  const condition = {};
  condition[columnName] = { [Op.iLike]: `%${searchValue}%` };
  return condition;
};

export const listQuery = ({
  status,
  searchString,
  name,
  department,
  title,
  extension,
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
    const likeClause = { [Op.iLike]: `%${searchString}%` };
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
  } else {
    if (name) {
      query.where[Op.or] = [
        makeSearchCondition('firstName', name),
        makeSearchCondition('lastName', name),
      ];
    }
    if (department) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeSearchCondition('department', department));
    }
    if (title) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeSearchCondition('title', title));
    }
    if (extension) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeSearchCondition('extension', extension));
    }
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  return query;
};
