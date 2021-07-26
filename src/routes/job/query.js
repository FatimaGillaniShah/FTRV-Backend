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
      as: 'user',
      attributes: ['fullName', 'firstName', 'lastName'],
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'locationId', 'departmentId', 'userId'],
  };
  return query;
};
