const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING, DATE, TEXT }) => {
  class Event extends Model {
    static associate({ EventLocation, Location }) {
      this.belongsToMany(Location, {
        through: EventLocation,
        foreignKey: 'eventId',
        otherKey: 'locationId',
        as: 'locationIds',
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
      description: TEXT,
      startDate: {
        type: DATE,
        allowNull: false,
      },
      endDate: {
        type: DATE,
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
