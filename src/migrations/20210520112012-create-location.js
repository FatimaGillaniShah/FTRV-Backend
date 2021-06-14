'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE }) => {
    await queryInterface.createTable({
      tableName:'Locations',
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
    await queryInterface.dropTable('Locations');
  }
};
