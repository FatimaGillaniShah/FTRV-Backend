import sequelize from 'sequelize';
import moment from 'moment';

const { Op } = sequelize;

export const listQuery = ({
  sortColumn,
  sortOrder,
  pageNumber,
  pageSize,
  isPagination = false,
}) => {
  const query = { where: {} };
  query.attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

  // for pagination
  if (Number(isPagination)) {
    query.offset = (pageNumber - 1) * pageSize;
    query.limit = pageSize;
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  query.order = [['startTime', 'ASC']];

  return query;
};

export const dashboardListQuery = ({ status }) => {
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
