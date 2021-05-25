import { Model } from 'sequelize';

export default (sequelize, { INTEGER }) => {
  class EventLocation extends Model {}
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
        references: {
          model: 'Location',
          key: 'locationId',
        },
      },
      eventId: {
        type: INTEGER,
        references: {
          model: 'Event',
          key: 'eventId',
        },
      },
    },
    {
      sequelize,
      modelName: 'EventLocation',
    }
  );
  return EventLocation;
};
