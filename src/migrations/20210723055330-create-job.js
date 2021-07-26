'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE }) => {
    await queryInterface.createTable({
          tableName: 'Jobs',
          schema: process.env.SCHEMA_NAME,
        },
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: INTEGER,
            autoIncrement: true,
          },
          title: {
            type: STRING,
            allowNull: false,
          },
          jobDescription: {
            type: STRING,
            allowNull: false,
          },
          locationId: {
            type: INTEGER,
            allowNull: false,
            references: {
              model: 'Locations',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          departmentId: {
            type: INTEGER,
            allowNull: false,
            references: {
              model: 'Departments',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          userId: {
            type: INTEGER,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          expiryDate: {
            type: DATE,
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
    await queryInterface.dropTable('Jobs');
  }
};
