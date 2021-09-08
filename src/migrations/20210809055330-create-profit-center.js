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
          faxNumber: {
            type: INTEGER,
            allowNull: true,
          },
          contactNo: {
            type: STRING,
            allowNull: false,
          },
          centerNumber: {
            type: INTEGER,
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
