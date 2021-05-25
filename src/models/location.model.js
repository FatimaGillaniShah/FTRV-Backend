const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class Location extends Model {}
  Location.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: STRING,
    },
    {
      sequelize,
      modelName: 'Location',
    }
  );
  return Location;
};
