'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE }) => {
    await queryInterface.createTable({
      tableName: 'UsefulLinks',
      schema: process.env.SCHEMA_NAME,
    }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      url: {
        type: STRING,
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
    await queryInterface.dropTable('UsefulLinks');
  }
};
