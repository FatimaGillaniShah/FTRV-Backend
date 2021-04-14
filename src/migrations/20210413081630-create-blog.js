'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, TEXT }) => {
    await queryInterface.createTable({
      tableName: 'Blogs',
      schema: process.env.SCHEMA_NAME,
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
      content: {
        type: TEXT
      },
      userId: {
        type: INTEGER
      },
      shortText: {
        type: STRING
      },
      thumbnail: {
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
    await queryInterface.dropTable('Blogs');
  }
};
