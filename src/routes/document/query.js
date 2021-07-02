export const getDocumentByIdQuery = (documentId) => {
  const query = {};
  query.where = {
    id: documentId,
  };
  query.attributes = {
    exclude: ['createdAt', 'updatedAt'],
  };
  return query;
};
