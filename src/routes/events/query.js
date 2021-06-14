import models from '../../models';

const { Event } = models;

export const listQuery = ({ sortColumn, sortOrder, pageNumber = 1, pageSize, locationId }) => {
  let query;
  if (locationId) {
    query = {
      where: { id: locationId },
      include: { model: Event, as: 'eventIds', through: { attributes: [] } },
    };
  } else {
    query = { where: {} };
  }
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
