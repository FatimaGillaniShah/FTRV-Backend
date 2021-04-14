'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, ENUM }) => {
    await queryInterface.createTable({
      tableName: 'Polls',
      schema: process.env.SCHEMA_NAME
    }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },
      name: {
        type: STRING
      },
      question: {
        type: STRING
      },
      status: {
        type: ENUM('active', 'inactive')
      },
      startDate: {
        type: DATE
      },
      endDate: {
        type: DATE
      },
      createdAt: {
        allowNull: false,
        type: DATE
      },
      updatedAt: {
        allowNull: false,
        type: DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Polls');
  }
};
