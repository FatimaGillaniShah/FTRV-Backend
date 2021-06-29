'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE }) => {
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
        type: STRING
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
