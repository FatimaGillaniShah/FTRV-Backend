'use strict';
const tableName = 'Users';
const colNameLoc = 'locationId'
const colNameDept = 'departmentId'

module.exports = {
  up: async (queryInterface, { INTEGER }) => {
    await queryInterface.addColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameLoc, {
      type: INTEGER,
      references: {
        model: 'Locations',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      }
    );
    await queryInterface.addColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameDept,{
      type: INTEGER,
      references: {
        model: 'Departments',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameLoc
    );
    await queryInterface.removeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameDept
    );
  }
};
