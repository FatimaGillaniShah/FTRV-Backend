export default (sequelize, { STRING, INTEGER, ENUM }) => {
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

  User.prototype.fullName = function () {
    return `${this.firstName} ${this.lastName}`;
  };
  // associate a role to user
  // User.associate = function (models) {
  // 	models.User.belongsTo(models.Role, {foreignKey: 'roleId'});
  // };

  return User;
};
