export const listQuery = () => {
  const query = { where: { name: 'HOME-BANNER-IMAGE' } };
  query.attributes = ['data'];

  return query;
};
