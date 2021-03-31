'use strict';
module.exports = {
  up: async (queryInterface, {INTEGER, STRING, DATE}) => {
    await queryInterface.createTable({
      tableName: 'Events',
      schema: process.env.SCHEMA_NAME
    }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },
      title: {
        type: STRING
      },
      description: {
        type: STRING
      },
      startDate: {
        allowNull: false,
        type: DATE
      },
      endDate: {
        allowNull: false,
        type: DATE
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
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Events');
  }
};
