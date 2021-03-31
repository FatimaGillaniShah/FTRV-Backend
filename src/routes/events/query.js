export const listQuery = ({ sortColumn, sortOrder }) => {
  const query = { where: {} };

  query.attributes = { exclude: ['deletedAt'] };

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  return query;
};
