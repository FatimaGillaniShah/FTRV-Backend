'use strict';

module.exports = {
  up: async (queryInterface, { INTEGER, CITEXT, DATE, STRING, TEXT }) => {
    await queryInterface.createTable({
      tableName: 'Groups',
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
        type: CITEXT,
        allowNull: false,
        unique: true,
      },
      description: {
        type: TEXT,
        allowNull: true,
      },
      createdBy: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      updatedBy: {
        type: INTEGER,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
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
    await queryInterface.dropTable('Groups');
  }
};
