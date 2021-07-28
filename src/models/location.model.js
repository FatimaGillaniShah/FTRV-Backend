const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class Location extends Model {
    static associate({ EventLocation, Event, User, RingGroup, Job }) {
      this.hasMany(User, {
        as: 'users',
        foreignKey: 'locationId',
      });
      this.hasMany(RingGroup, {
        as: 'ringGroups',
        foreignKey: 'locationId',
      });
      this.belongsToMany(Event, {
        through: EventLocation,
        foreignKey: 'locationId',
        otherKey: 'eventId',
        as: 'eventIds',
      });
      this.hasMany(Job, {
        as: 'jobs',
        foreignKey: 'locationId',
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
