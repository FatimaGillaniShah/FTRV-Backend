import models from '../../models';

const { Location, Department, User } = models;

export const getJobByIdQuery = (id) => {
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
    {
      model: User,
      as: 'createdByUser',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'updatedByUser',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
  ];
  query.attributes = {
    exclude: [
      'createdAt',
      'updatedAt',
      'locationId',
      'departmentId',
      'userId',
      'createdBy',
      'updatedBy',
    ],
  };
  return query;
};

export const listJobs = ({ sortOrder, sortColumn, pageNumber, pageSize }) => {
  const query = { where: {} };
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
    {
      model: User,
      as: 'createdByUser',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'updatedByUser',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
  ];
  query.attributes = {
    exclude: [
      'createdAt',
      'updatedAt',
      'locationId',
      'departmentId',
      'userId',
      'createdBy',
      'updatedBy',
    ],
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
