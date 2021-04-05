export const listQuery = () => {
  const query = { where: { name: 'CEO-PAGE' } };
  query.attributes = ['data'];

  return query;
};
