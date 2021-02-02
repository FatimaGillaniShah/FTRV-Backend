export default (sequelize, { STRING, INTEGER, ENUM, VIRTUAL }) => {
  const User = sequelize.define(
    'User',
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
      contactNo: {
        type: STRING,
        allowNull: false,
      },
      role: {
        type: ENUM('admin', 'user'),
      },
      status: {
        type: ENUM('active', 'inactive'),
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
