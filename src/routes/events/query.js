import models from '../../models';

const { Event, Location } = models;

export const listQuery = ({ sortColumn, sortOrder, pageNumber = 1, pageSize, id }) => {
  const query = {
    where: { id },
    include: {
      model: Location,
      as: 'location',
      include: {
        model: Event,
        as: 'eventIds',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        through: { attributes: [] },
      },
    },
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
