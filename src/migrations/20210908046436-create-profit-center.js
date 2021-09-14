'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, TEXT, DATE }) => {
    await queryInterface.createTable({
          tableName: 'ProfitCenters',
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
          address: {
            type: STRING,
            allowNull: false,
          },
          managerId: {
            type: INTEGER,
            allowNull: true,
            references: {
              model: 'Users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          code: {
            type: STRING,
            allowNull: false,
          },
          faxNo: {
            type: STRING,
            allowNull: true,
          },
          contactNo: {
            type: STRING,
            allowNull: false,
          },
          centerNo: {
            type: INTEGER,
            allowNull: false,
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
    await queryInterface.dropTable('ProfitCenters');
  }
};
