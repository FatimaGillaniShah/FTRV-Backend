import { Model } from 'sequelize';

export default (sequelize, { INTEGER }) => {
  class EventLocation extends Model {
    static associate({ Location, Event }) {
      this.belongsTo(Location, {
        foreignKey: 'locationId',
      });
      this.belongsTo(Event, {
        foreignKey: 'eventId',
      });
    }
  }
  EventLocation.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      locationId: {
        type: INTEGER,
      },
      eventId: {
        type: INTEGER,
      },
    },
    {
      sequelize,
      modelName: 'EventLocation',
    }
  );
  return EventLocation;
};
