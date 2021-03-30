const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING, DATE }) => {
  class Event extends Model {}
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
    },
    {
      sequelize,
      modelName: 'Event',
    }
  );
  return Event;
};
