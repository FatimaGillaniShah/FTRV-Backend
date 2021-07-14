import models from '../../models';

const { Location, Department } = models;
export const getRingGroupByIdQuery = (id) => {
  const query = {};
  query.where = {
    id,
  };
  query.include = [
    {
      model: Location,
      as: 'location',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
    {
      model: Department,
      as: 'department',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'locationId', 'departmentId'],
  };
  return query;
};

export const listQuery = ({ sortColumn, sortOrder, pageNumber, pageSize }) => {
  const query = {};
  query.include = [
    {
      model: Location,
      as: 'location',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
    {
      model: Department,
      as: 'department',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'locationId', 'departmentId'],
  };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

  // for sorting
  if (sortColumn === 'location.name') {
    query.order = [[{ model: Location, as: 'location' }, 'name', sortOrder]];
  } else if (sortColumn === 'department.name') {
    query.order = [[{ model: Department, as: 'department' }, 'name', sortOrder]];
  } else if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }
  return query;
};
