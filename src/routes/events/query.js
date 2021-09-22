import moment from 'moment';
import sequelize from 'sequelize';
import models from '../../models';

const { Op, where, fn, col } = sequelize;

const { Event, Location } = models;

const threeMonthsQuery = (date) => {
  const endOfNextMonth = moment(date).endOf('month').add(1, 'M').format('YYYY/MM/DD');
  const startOfPrevMonth = moment(date).startOf('month').subtract(1, 'M').format('YYYY/MM/DD');
  return {
    [Op.or]: [
      {
        startDate: {
          [Op.between]: [startOfPrevMonth, endOfNextMonth],
        },
      },
      {
        endDate: {
          [Op.between]: [startOfPrevMonth, endOfNextMonth],
        },
      },
      {
        [Op.and]: [
          where(fn('date', col('endDate')), '>=', endOfNextMonth),
          where(fn('date', col('startDate')), '<=', startOfPrevMonth),
        ],
      },
    ],
  };
};

export const listUserEventsQuery = ({
  sortColumn,
  sortOrder,
  pageNumber = 1,
  pageSize,
  id,
  date,
}) => {
  const query = {
    where: { id },
    include: {
      model: Location,
      as: 'location',
      include: {
        model: Event,
        as: 'eventIds',
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        through: { attributes: [] },
      },
    },
  };
  // fetching records of three months e.g previous, current and next month records
  query.include.include.where = threeMonthsQuery(date);

  if (pageSize) {
    query.offset = (pageNumber - 1) * pageSize;
    query.limit = pageSize;
  }
  query.attributes = { exclude: ['createdAt', 'updatedAt', 'deletedAt'] };

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }
  return query;
};

export const listAllEventsQuery = ({ date }) => {
  const query = {};
  // fetching records of three months e.g previous, current and next month records
  query.where = threeMonthsQuery(date);
  return query;
};
