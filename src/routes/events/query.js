import models from '../../models';

const { Event, Location } = models;

export const listQuery = ({ sortColumn, sortOrder, pageNumber = 1, pageSize, role }) => {
  let query;
  if (role === 'admin') {
    query = {
      include: {
        model: Location,
        as: 'locationIds',
        include: {
          model: Event,
          as: 'eventIds',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: { attributes: [] },
        },
      },
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
