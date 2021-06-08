export const listQuery = ({ sortColumn, sortOrder, pageNumber = 1, pageSize }) => {
  const query = { where: {} };
  if (pageSize) {
    query.offset = (pageNumber - 1) * pageSize;
    query.limit = pageSize;
  }
  query.attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  return query;
};
export const eventLocationQuery = () => {
  const query = { where: {} };
   query.include = [
      {
        model: EventLocation,
        as: 'locationId',
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'id'],
        },
      },
    ]

  return query;
};