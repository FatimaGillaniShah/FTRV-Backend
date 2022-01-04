import { makeLikeCondition } from '../../utils/helper';

export const listQuery = ({ name }) => {
  const query = {
    attributes: {
      exclude: ['createdAt', 'updatedAt'],
    },
  };
  if (name) {
    query.where = [makeLikeCondition('name', name)];
  }
  return query;
};
