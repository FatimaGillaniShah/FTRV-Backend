import sequelize from 'sequelize';
import models from '../../models';

const { Op, fn, cast } = sequelize;
const { Location, Department } = models;

const makeSearchCondition = (columnName, searchValue) => {
  const condition = {};
  condition[columnName] = { [Op.iLike]: `%${searchValue}%` };
  return condition;
};

export const birthdayQuery = (date) => {
  const query = {
    where: {
      [Op.and]: [
        sequelize.where(
          fn('date_part', 'day', sequelize.col('dob')),
          fn('date_part', 'day', cast(date, 'date'))
        ),
        sequelize.where(
          fn('date_part', 'month', sequelize.col('dob')),
          fn('date_part', 'month', cast(date, 'date'))
        ),
      ],
    },
  };
  query.attributes = ['id', 'firstName', 'lastName', 'dob', 'avatar', 'fullName'];

  return query;
};

export const listQuery = ({
  status,
  searchString,
  name,
  department,
  title,
  extension,
  location,
  sortColumn,
  sortOrder,
  pageNumber = 1,
  pageSize,
}) => {
  const query = { where: {} };

  query.offset = (pageNumber - 1) * pageSize;
  query.limit = pageSize;
  query.attributes = { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] };
  if (status) {
    query.where[Op.and] = [{ status }];
  }
  // for filtering
  if (searchString) {
    const likeClause = { [Op.iLike]: `%${searchString}%` };
    query.where[Op.or] = [
      {
        firstName: likeClause,
      },
      {
        lastName: likeClause,
      },
      {
        email: likeClause,
      },
    ];
    const integerValue = parseInt(searchString, 10);
    if (integerValue > 0) {
      query.where[Op.or].push({
        id: integerValue,
      });
    }
  } else {
    if (name) {
      query.where[Op.or] = [
        makeSearchCondition('firstName', name),
        makeSearchCondition('lastName', name),
      ];
    }
    if (department) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeSearchCondition('department', department));
    }
    if (title) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeSearchCondition('title', title));
    }
    if (extension) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeSearchCondition('extension', extension));
    }
    if (location) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeSearchCondition('location', location));
    }
  }

  // for sorting
  if (sortColumn && sortOrder) {
    query.order = [[sortColumn, sortOrder]];
  }

  return query;
};

export const getUserByIdQuery = ({ id }) => {
  const query = {
    where: {
      id,
    },
  };
  query.attributes = {
    exclude: [
      'id',
      'fullName',
      'password',
      'createdAt',
      'updatedAt',
      'deletedAt',
      'locationId',
      'departmentId',
    ],
  };
  query.include = [
    {
      model: Location,
      as: 'locations',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
    {
      model: Department,
      as: 'departments',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
    },
  ];
  return query;
};
