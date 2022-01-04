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
