import sequelize from 'sequelize';
import models from '../../models';
import { makeEqualityCondition, makeLikeCondition } from '../../utils/helper';

const { Op, fn, cast, col } = sequelize;
const { Location, Department, Group, Resource } = models;

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

export const anniversaryQuery = (date) => {
  const query = {
    where: {
      [Op.and]: [
        sequelize.where(
          fn('date_part', 'day', sequelize.col('joiningDate')),
          fn('date_part', 'day', cast(date, 'date'))
        ),
        sequelize.where(
          fn('date_part', 'month', sequelize.col('joiningDate')),
          fn('date_part', 'month', cast(date, 'date'))
        ),
        // only get those users which have spent at least 1 year with organization
        sequelize.where(
          fn('date_part', 'year', fn('AGE', cast(date, 'date'), sequelize.col('joiningDate'))),
          {
            [Op.gt]: 0,
          }
        ),
      ],
    },
  };
  query.attributes = [
    'id',
    'firstName',
    'lastName',
    'joiningDate',
    'avatar',
    'fullName',
    [fn('date_part', 'year', fn('AGE', cast(date, 'date'), sequelize.col('joiningDate'))), 'years'],
  ];
  query.group = ['id'];

  return query;
};

export const listQuery = ({
  status,
  searchString,
  name,
  departmentId,
  title,
  extension,
  locationId,
  sortColumn,
  sortOrder,
  pageNumber = 1,
  pageSize,
  detail,
  isPagination = false,
}) => {
  const query = { where: {} };
  // eslint-disable-next-line no-param-reassign
  detail = JSON.parse(detail);
  if (Number(isPagination)) {
    query.offset = (pageNumber - 1) * pageSize;
    query.limit = pageSize;
  }
  query.distinct = true;
  query.attributes = detail
    ? { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] }
    : ['id', 'firstName', 'lastName', 'fullName'];
  query.include = detail && [
    {
      model: Location,
      as: 'location',
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'id'],
      },
    },
    {
      model: Department,
      as: 'department',
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'id'],
      },
    },
    {
      model: Group,
      as: 'groups',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      through: { attributes: [] },
    },
  ];
  if (status) {
    query.where[Op.and] = [{ status }];
  }
  // for filtering
  if (searchString) {
    const likeClause = { [Op.iLike]: `%${searchString}%` };
    query.where[Op.or] = [
      sequelize.where(fn('concat', col('firstName'), ' ', col('lastName')), likeClause),
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
      query.where[Op.and] = [
        sequelize.where(fn('concat', col('firstName'), ' ', col('lastName')), {
          [Op.iLike]: `%${name}%`,
        }),
      ];
    }
    if (departmentId) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeEqualityCondition('departmentId', departmentId));
    }
    if (title) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeLikeCondition('title', title));
    }
    if (extension) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeLikeCondition('extension', extension));
    }
    if (locationId) {
      query.where[Op.and] = query.where[Op.and] || [];
      query.where[Op.and].push(makeEqualityCondition('locationId', locationId));
    }
  }

  // for sorting
  if (sortColumn === 'location.name') {
    query.order = [[{ model: Location, as: 'location' }, 'name', sortOrder]];
  } else if (sortColumn === 'department.name') {
    query.order = [[{ model: Department, as: 'department' }, 'name', sortOrder]];
  } else if (sortColumn && sortOrder) {
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
    {
      model: Group,
      as: 'groups',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      through: { attributes: [] },
      include: [
        {
          model: Resource,
          as: 'resources',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: { as: 'resourcePermission', attributes: ['permission'] },
        },
      ],
    },
  ];
  return query;
};

export const getLoggedUserQuery = (id) => ({
  where: {
    id,
  },
  attributes: ['id'],
  include: [
    {
      model: Group,
      as: 'groups',
      attributes: ['id', 'name'],
      through: { attributes: [] },
      include: [
        {
          model: Resource,
          as: 'resources',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: { as: 'resourcePermission', attributes: ['permission'] },
        },
      ],
    },
  ],
});

export const findOrCreateGoogleUserQuery = ({ email, avatar, firstName, lastName }) => ({
  where: {
    email,
  },
  defaults: {
    status: 'active',
    avatar,
    firstName,
    lastName,
    password: '',
  },
  include: [
    {
      model: Group,
      as: 'groups',
      attributes: ['id', 'name'],
      through: { attributes: [] },
      include: [
        {
          model: Resource,
          as: 'resources',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: { as: 'resourcePermission', attributes: ['permission'] },
        },
      ],
    },
  ],
});

export const deleteUserGroupQuery = (userId) => ({
  where: {
    userId,
  },
});

export const listGroups = (name) => ({
  where: {
    name,
  },
});

export const updateUserQuery = (id) => ({
  where: {
    id,
  },
});
export const userExistQuery = (id) => ({
  where: {
    id,
  },
});

export const getUserByIdWithGroups = ({ id }) => ({
  where: {
    id,
  },
  include: [
    {
      model: Group,
      as: 'groups',
      attributes: {
        exclude: ['createdAt', 'updatedAt'],
      },
      through: { attributes: [] },
      include: [
        {
          model: Resource,
          as: 'resources',
          attributes: { exclude: ['createdAt', 'updatedAt'] },
          through: { as: 'resourcePermission', attributes: ['permission'] },
        },
      ],
    },
  ],
});
export const listTitleQuery = () => ({
  where: { title: { [Op.ne]: null } },
  attributes: [[fn('DISTINCT', col('title')), 'title']],
  order: [['title', 'asc']],
});
