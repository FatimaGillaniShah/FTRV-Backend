export const listQuery = ({ sortColumn, sortOrder, pageNumber = 1, pageSize }) => {
  const query = {};
  if (pageSize) {
    query.offset = (pageNumber - 1) * pageSize;
    query.limit = pageSize;
  }
  query.attributes = { exclude: ['createdAt', 'updatedAt'] };

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }
  query.order = [['name', 'asc']];
  return query;
};
