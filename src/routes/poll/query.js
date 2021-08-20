import models from '../../models';

const { User } = models;
export const getPollByIdQuery = (id) => {
  const query = {};
  query.where = {
    id,
  };
  query.include = [
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
