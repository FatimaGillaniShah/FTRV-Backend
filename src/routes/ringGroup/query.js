import models from '../../models';

const { Location, Department } = models;
export const getRingGroupByIdQuery = (ringGroupId) => {
  const query = {};
  query.where = {
    id: ringGroupId,
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
