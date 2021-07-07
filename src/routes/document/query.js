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

export const listDocuments = () => {
  const query = {};
  query.attributes = ['id', 'name'];
  query.include = {
    model: Document,
    as: 'documents',
    required: true,
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  };
  return query;
};

export const listDocumentsByDepartmentId = (departmentId) => {
  const query = {
    where: { id: departmentId },
  };
  query.attributes = ['id', 'name'];
  query.include = {
    model: Document,
    as: 'documents',
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  };
  return query;
};
