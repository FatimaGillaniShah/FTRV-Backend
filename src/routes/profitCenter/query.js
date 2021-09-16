import sequelize from 'sequelize';
import models from '../../models';
import { makeEqualityCondition } from '../../utils/helper';

const { Op, col, fn } = sequelize;
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

export const listProfitCentersQuery = ({
  name,
  address,
  sortOrder,
  sortColumn,
  pageNumber,
  pageSize,
  searchString,
}) => {
  console.log('here', name, address);
  const query = { where: {} };
  query.distinct = true;
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'managerId', 'createdBy', 'updatedBy'],
  };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

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

  // for filtering
  if (searchString) {
    const likeClause = { [Op.iLike]: `%${searchString}%` };
    query.where[Op.or] = [
      sequelize.where(fn('concat', col('firstName'), ' ', col('lastName')), likeClause),
      {
        email: likeClause,
      },
    ];
    const integerValue = parseInt(searchString, 10);
    if (integerValue > 0) {
      query.where[Op.or].push({
        id: integerValue,
      });
    }
  } else {
    if (name) {
      query.where[Op.and] = [
        sequelize.where(fn('concat', col('firstName'), ' ', col('lastName')), {
          [Op.iLike]: `%${name}%`,
        }),
      ];
    }
    if (address) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeEqualityCondition('address', address));
    }
    // for sorting
    if (sortColumn === 'manager.firstName') {
      query.order = [[{ model: User, as: 'manager' }, 'firstName', sortOrder]];
    } else if (sortColumn && sortOrder) {
      query.order = [[sortColumn, sortOrder]];
    }
    return query;
  }
};
export const deleteProfitCenterQuery = (id) => ({
  where: {
    id,
  },
});
