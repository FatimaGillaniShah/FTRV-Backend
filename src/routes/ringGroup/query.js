export const getRingGroupByIdQuery = (ringGroupId) => {
  const query = {};
  query.where = {
    id: ringGroupId,
  };
  query.attributes = {
    exclude: ['createdAt', 'updatedAt'],
  };
  return query;
};
