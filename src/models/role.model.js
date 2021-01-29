export default (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
  });

  return Role;
};
