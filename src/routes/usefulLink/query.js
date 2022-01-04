export const listQuery = ({
  categoryId,
  sortColumn,
  sortOrder,
  pageNumber = 1,
  pageSize,
  isPagination = false,
}) => {
  const query = { where: { categoryId } };
  query.attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

  // for pagination
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
