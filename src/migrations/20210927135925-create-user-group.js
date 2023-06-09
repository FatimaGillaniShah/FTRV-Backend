'use strict';

module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE }) => {
    await queryInterface.createTable({
      tableName: 'UserGroups',
      schema: process.env.SCHEMA_NAME,
    },
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      userId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      groupId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'Groups',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
    await queryInterface.dropTable('UserGroups');
  }
};
