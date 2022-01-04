'use strict';

module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, ARRAY }) => {
    await queryInterface.createTable({
      tableName: 'GroupPermissions',
      schema: process.env.SCHEMA_NAME,
    },
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
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
      resourceId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'Resources',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      permission: {
        type: ARRAY(STRING),
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('GroupPermissions');
  }
};
