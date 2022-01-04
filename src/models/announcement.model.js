const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING, DATEONLY, ENUM, TEXT }) => {
  class Announcement extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }

  Announcement.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      title: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: TEXT,
        allowNull: false,
      },
      startTime: {
        type: DATEONLY,
        allowNull: false,
      },
      endTime: {
        type: DATEONLY,
        allowNull: false,
      },
      status: {
        type: ENUM('active', 'inactive'),
        allowNull: false,
      },
      priority: {
        type: ENUM('high', 'medium', 'low'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Announcement',
      paranoid: true,
      timestamps: true,
    }
  );

  return Announcement;
};
