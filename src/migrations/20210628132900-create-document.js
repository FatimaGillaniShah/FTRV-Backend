'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, TEXT }) => {
    await queryInterface.createTable({
      tableName: 'Documents',
      schema: process.env.SCHEMA_NAME,
    },
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },
      name: {
        type: STRING
      },
      description: {
        type: TEXT
      },
      url: {
        type: STRING
      },
      departmentId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'Departments',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      sortOrder: {
        allowNull: false,
        type: INTEGER
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
    await queryInterface.dropTable('Documents');
  }
};
