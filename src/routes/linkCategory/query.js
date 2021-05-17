import Sequelize from 'sequelize';
import models from '../../models';

const { UsefulLink } = models;

const { fn, col } = Sequelize;
export const listQuery = () => {
  const query = {
    include: [
      {
        model: UsefulLink,
        attributes: [],
      },
    ],
  };
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'deletedAt'],
    include: [[fn('COUNT', col('UsefulLinks.id')), 'linksCount']],
  };
  query.order = [['name', 'ASC']];
  query.group = ['LinkCategory.id'];

  return query;
};
