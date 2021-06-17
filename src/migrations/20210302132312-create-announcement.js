'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, DATEONLY, ENUM }) => {
    await queryInterface.createTable({
      tableName: 'Announcements',
      schema: process.env.SCHEMA_NAME,
    }, {
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
      createdAt: {
        allowNull: false,
        type: DATE
      },
      updatedAt: {
        allowNull: false,
        type: DATE
      },
      deletedAt: {
        allowNull: true,
        type: DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Announcements');
  }
};
