import models from '../../models';

export const listQuery = ({ sortColumn, sortOrder, pageNumber = 1, pageSize }) => {
  const { Location } = models;
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
  query.include = [
    {
      model: Location,
      as: 'locationIds',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  ];
  return query;
};
