import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER, ENUM, VIRTUAL, DATEONLY, BOOLEAN }) => {
  class User extends Model {
    static associate({
      Department,
      Location,
      Blog,
      UserPollVote,
      Job,
      JobApplicant,
      Poll,
      ProfitCenter,
      Group,
      UserGroup,
    }) {
      this.belongsTo(Location, {
        foreignKey: 'locationId',
        as: 'location',
      });
      this.belongsTo(Department, {
        foreignKey: 'departmentId',
        as: 'department',
      });
      this.hasMany(Blog, {
        foreignKey: 'userId',
      });
      this.hasMany(Job, {
        foreignKey: 'createdBy',
      });
      this.hasMany(Job, {
        foreignKey: 'updatedBy',
      });
      this.hasMany(UserPollVote, {
        foreignKey: 'userId',
      });
      this.hasMany(JobApplicant, {
        foreignKey: 'userId',
      });
      this.belongsToMany(Job, {
        through: JobApplicant,
        otherKey: 'userId',
        foreignKey: 'jobId',
      });
      this.hasMany(Poll, {
        foreignKey: 'createdBy',
      });
      this.hasMany(Poll, {
        foreignKey: 'updatedBy',
      });
      this.hasMany(ProfitCenter, {
        foreignKey: 'managerId',
      });
      this.hasMany(ProfitCenter, {
        foreignKey: 'createdBy',
      });
      this.hasMany(ProfitCenter, {
        foreignKey: 'updatedBy',
      });
      this.hasMany(Group, {
        foreignKey: 'createdBy',
      });
      this.hasMany(Group, {
        foreignKey: 'updatedBy',
      });
      this.belongsToMany(Group, {
        through: UserGroup,
        foreignKey: 'userId',
        otherKey: 'groupId',
        as: 'groups',
      });
    }
  }

  User.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      firstName: {
        type: STRING,
        allowNull: false,
      },
      lastName: {
        type: STRING,
        allowNull: false,
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: STRING,
        allowNull: false,
      },
      isAdmin: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      contactNo: {
        type: STRING,
        allowNull: true,
      },
      extension: {
        type: STRING,
        allowNull: true,
      },
      locationId: {
        type: INTEGER,
        allowNull: true,
      },
      departmentId: {
        type: INTEGER,
        allowNull: true,
      },
      title: {
        type: STRING,
        allowNull: true,
      },
      role: {
        type: ENUM('admin', 'user'),
        allowNull: true,
      },
      status: {
        type: ENUM('active', 'inactive'),
      },
      avatar: {
        type: STRING,
      },
      joiningDate: {
        type: DATEONLY,
      },
      dob: {
        type: DATEONLY,
      },
      fullName: {
        type: VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set() {
          throw new Error('Do not try to set the `fullName` value!');
        },
      },
    },
    {
      sequelize,
      modelName: 'User',
      paranoid: true,
      timestamps: true,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['email'],
        },
      ],
    }
  );
  return User;
};
