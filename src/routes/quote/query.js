export const listQuery = () => {
  const query = { where: { name: 'QUOTE' } };
  query.attributes = ['data'];

  return query;
};
