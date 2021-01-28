module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      contactNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // for storing some value in stringified form
      // values : {
      // 	type: DataTypes.STRING,
      // 	allowNull: false,
      // 	get: function () {
      // 		return JSON.parse(this.getDataValue('values'));
      // 	},
      // 	set: function (value) {
      // 		this.setDataValue('values', JSON.stringify(value));
      // 	},
      // }
    },
    // for soft deletion
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

  // associate a role to user
  // User.associate = function (models) {
  // 	models.User.belongsTo(models.Role, {foreignKey: 'roleId'});
  // };

  return User;
};
