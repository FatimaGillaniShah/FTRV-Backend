export default (sequelize, { STRING, INTEGER, DATEONLY, ENUM }) => {
  const Announcement = sequelize.define(
    'Announcement',
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
        type: STRING,
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
      paranoid: true,
      timestamps: true,
    }
  );

  return Announcement;
};
