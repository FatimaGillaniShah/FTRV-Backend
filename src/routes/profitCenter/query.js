import models from '../../models';

const { User } = models;


export const updateProfitCenterQuery = (id) => ({
  where: {
    id,
  },
});
export const getProfileCenterByIdQuery = (id) => {
  const query = {};
  query.where = {
    id,
  };
  query.include = [
    {
      model: User,
      as: 'manager',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'createdByUser',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
    {
      model: User,
      as: 'updatedByUser',
      attributes: ['id', 'fullName', 'firstName', 'lastName'],
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
  };
  return query;
};
