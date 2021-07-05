import models from '../../models';

const { Document } = models;

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

export const listDocuments = (departmentId) => {
  const query = {
    where: { id: departmentId },
  };
  query.attributes = ['id'];
  query.include = {
    model: Document,
    as: 'documents',
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  };
  return query;
};
