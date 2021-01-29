export default (sequelize, { STRING, INTEGER }) => {
  const UsefulLink = sequelize.define('UsefulLinks', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: INTEGER,
      autoIncrement: true,
    },
    category: {
      type: STRING,
      allowNull: true,
    },
    name: {
      type: STRING,
      allowNull: true,
    },
    url: {
      type: STRING,
      allowNull: false,
    },
  });

  return UsefulLink;
};
