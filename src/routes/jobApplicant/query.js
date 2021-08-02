import models from '../../models';

const { Location, Department, User } = models;

export const listQuery = ({ jobId, sortOrder, sortColumn, pageNumber, pageSize }) => {
  const query = { where: { jobId } };
  query.include = [
    {
      model: User,
      as: 'user',
      attributes: ['fullName', 'firstName', 'lastName', 'title', 'email'],
      include: [
        {
          model: Location,
          as: 'location',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
        {
          model: Department,
          as: 'department',
          attributes: {
            exclude: ['createdAt', 'updatedAt'],
          },
        },
      ],
    },
  ];
  query.attributes = {
    exclude: ['createdAt', 'updatedAt', 'userId', 'jobId'],
  };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;

  // for sorting
  if (sortColumn === 'location.name') {
    query.order = [
      [{ model: User, as: 'user' }, { model: Location, as: 'location' }, 'name', sortOrder],
    ];
  } else if (sortColumn === 'department.name') {
    query.order = [
      [{ model: User, as: 'user' }, { model: Department, as: 'department' }, 'name', sortOrder],
    ];
  } else if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }
  return query;
};
