import sequelize from 'sequelize';
import moment from 'moment';

const { Op } = sequelize;

export const listQuery = ({ status }) => {
  const query = { where: {} };
  query.attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

  const currentTime = moment().format('YYYY-MM-DD');
  if (status) {
    query.where[Op.and] = [
      { status, startTime: { [Op.lte]: currentTime }, endTime: { [Op.gte]: currentTime } },
    ];
  }

  query.order = [['startTime', 'ASC']];

  return query;
};
