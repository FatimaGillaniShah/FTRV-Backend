import models from '../../models';

const { User } = models;

export const listQuery = ({
  sortColumn,
  sortOrder,
  pageNumber = 1,
  pageSize,
  isPagination = false,
}) => {
  const query = {
    where: {},
    include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
  };
  query.attributes = { exclude: ['content'] };
  if (Number(isPagination)) {
    query.offset = (pageNumber - 1) * pageSize;
    query.limit = pageSize;
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  return query;
};
