import models from '../../models';

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
