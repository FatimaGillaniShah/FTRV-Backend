export default (sequelize, { STRING, INTEGER }) => {
  const UsefulLink = sequelize.define(
    'UsefulLink',
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      url: {
        type: STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    }
  );

  return UsefulLink;
};
