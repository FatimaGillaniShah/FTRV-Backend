'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, JSON }) => {
    await queryInterface.createTable({
      tableName: 'Contents',
      schema: process.env.SCHEMA_NAME
    }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },
      name: {
        type: STRING,
        allowNull: false,
        unique: true,
      },
      data: {
        type: JSON,
        allowNull: false,
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
    await queryInterface.dropTable('Contents');
  }
};