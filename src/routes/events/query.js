import moment from 'moment';
import sequelize from 'sequelize';
import models from '../../models';

const { Op, where, fn, col } = sequelize;

const { Event, Location } = models;

export const listUserEventsQuery = ({
  sortColumn,
  sortOrder,
  pageNumber = 1,
  pageSize,
  id,
  date,
}) => {
  const nextMonth = moment(date).endOf('month').add(1, 'M').format('YYYY/MM/DD');
  const prevMonth = moment(date).startOf('month').subtract(1, 'M').format('YYYY/MM/DD');
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
  query.include.include.where = {
    [Op.or]: [
      {
        [Op.and]: [
          where(fn('date', col('startDate')), '<=', nextMonth),
          where(fn('date', col('startDate')), '>=', prevMonth),
        ],
      },
      {
        [Op.and]: [
          where(fn('date', col('endDate')), '<=', nextMonth),
          where(fn('date', col('endDate')), '>=', prevMonth),
        ],
      },
      {
        [Op.and]: [
          where(fn('date', col('endDate')), '>=', nextMonth),
          where(fn('date', col('startDate')), '<=', prevMonth),
        ],
      },
    ],
  };

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
  const nextMonth = moment(date).endOf('month').add(1, 'M').format('YYYY/MM/DD');
  const prevMonth = moment(date).startOf('month').subtract(1, 'M').format('YYYY/MM/DD');
  const query = {};
  // fetching records of three months e.g previous, current and next month records
  query.where = {
    [Op.or]: [
      {
        [Op.and]: [
          where(fn('date', col('startDate')), '<=', nextMonth),
          where(fn('date', col('startDate')), '>=', prevMonth),
        ],
      },
      {
        [Op.and]: [
          where(fn('date', col('endDate')), '<=', nextMonth),
          where(fn('date', col('endDate')), '>=', prevMonth),
        ],
      },
      {
        [Op.and]: [
          where(fn('date', col('endDate')), '>=', nextMonth),
          where(fn('date', col('startDate')), '<=', prevMonth),
        ],
      },
    ],
  };
  return query;
};
