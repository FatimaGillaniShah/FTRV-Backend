const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class Location extends Model {
    static associate({ EventLocation, Event, User }) {
      this.hasMany(User, {
        as: 'users',
        foreignKey: 'locationId',
      });
      this.belongsToMany(Event, {
        through: EventLocation,
        foreignKey: 'locationId',
        otherKey: 'eventId',
        as: 'eventIds',
      });
    }
  }
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
