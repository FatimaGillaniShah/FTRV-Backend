import sequelize from 'sequelize';
import models from '../../models';
import { makeEqualityCondition, makeLikeCondition } from '../../utils/helper';

const { Op } = sequelize;

const { User, PollOption, UserPollVote } = models;
export const getPollByIdQuery = (id) => {
  const query = {};
  query.where = {
    id,
  };
  query.include = [
    {
      model: PollOption,
      as: 'options',
      attributes: { exclude: ['createdAt', 'updatedAt', 'pollId'] },
      include: {
        model: UserPollVote,
        as: 'voted',
        attributes: ['userId'],
      },
    },
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
    exclude: ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
  };
  return query;
};

export const updateQuery = (id) => ({
  where: {
    id,
  },
});

export const listPolls = ({
  sortOrder,
  sortColumn,
  pageNumber,
  pageSize,
  searchString,
  name,
  status,
}) => {
  const query = { where: {} };
  const pollStates = ['pending', 'expired'];
  const isPollState = pollStates.includes(status);
  query.distinct = true;
  query.include = [
    {
      model: PollOption,
      as: 'options',
      attributes: { exclude: ['createdAt', 'updatedAt', 'pollId'] },
      include: {
        model: UserPollVote,
        as: 'voted',
        attributes: ['userId'],
      },
    },
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
    exclude: ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'],
  };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

  // for filtering
  if (searchString) {
    query.where[Op.or] = [];
    const searchColumns = ['name'];
    searchColumns.map((val) => query.where[Op.or].push(makeLikeCondition(val, searchString)));
  } else {
    if (name) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeLikeCondition('name', name));
    }
    if (status && !isPollState) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeEqualityCondition('status', status));
    }
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  } else {
    query.order = [[{ model: PollOption, as: 'options' }, 'id', 'asc']];
  }
  return query;
};

export const pollOptionQuery = (id) => ({
  where: {
    id,
  },
});
export const pollExistQuery = (id) => ({
  where: {
    id,
  },
});
export const votedQuery = ({ userId, pollId }) => ({
  where: {
    userId,
    pollId,
  },
});
