import sequelize from 'sequelize';

const { Op } = sequelize;

export const listQuery = () => {
  const query = { where: { name: 'QUOTE' } };
  query.attributes = ['data'];

  return query;
};
