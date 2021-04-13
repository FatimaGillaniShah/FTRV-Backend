export const listQuery = ({ sortColumn, sortOrder, pageNumber = 1, pageSize }) => {
  const query = { where: {} };
  if (pageSize) {
    query.offset = (pageNumber - 1) * pageSize;
    query.limit = pageSize;
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  return query;
};
