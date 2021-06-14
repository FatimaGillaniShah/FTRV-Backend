import models from '../../models';

const { Event } = models;

export const listQuery = ({ sortColumn, sortOrder, pageNumber = 1, pageSize, locationId }) => {
  const query = {
    where: { id: locationId },
    include: { model: Event, as: 'eventIds', through: { attributes: [] } },
  };
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
