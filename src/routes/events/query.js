import EventLocation from '../../models/eventLocation.model';
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
export const eventLocationQuery = (locationId) => {
  console.log(locationId)
  const query = { where: {locationId} };
   query.include = [
      {
        model: EventLocation,
        as: 'id',
        attributes: {
          exclude: ['createdAt', 'updatedAt'],
        },
      },
    ]

  return query;
};