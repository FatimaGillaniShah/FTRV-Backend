const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING, DATE , JSON}) => {
  class Event extends Model {
    static associate({ EventLocation, Location }) {
      this.belongsToMany(Location, {
        through: EventLocation,
        foreignKey: 'eventId',
        otherKey: 'locationId',
      });
    }
  }
  Event.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      title: STRING,
      description: STRING,
      startDate: {
        type: DATE,
        allowNull: false,
      },
      endDate: {
        type: DATE,
        allowNull: false,
      },
      locationId: {
        type: INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Event',
    }
  );
  return Event;
};
