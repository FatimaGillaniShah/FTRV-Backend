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
  const query = {};
  query.where = departmentId ? { id: departmentId } : {};
  query.attributes = ['id', 'name'];
  query.include = {
    model: Document,
    as: 'documents',
    required: !departmentId,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  };
  query.order = [[{ model: Document, as: 'documents' }, 'sortOrder', 'asc']];
  return query;
};
