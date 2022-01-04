'use strict';

module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, TEXT }) => {
    await queryInterface.createTable({
      tableName: 'Resources',
      schema: process.env.SCHEMA_NAME,
    },
    {
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
      slug: {
        type: STRING,
        allowNull: false,
      },
      description: {
        type: TEXT,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DATE
      },
      updatedAt: {
        allowNull: false,
        type: DATE
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Resources');
  }
};
