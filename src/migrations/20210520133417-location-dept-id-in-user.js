'use strict';
const tableName = 'Users';
const colNameLoc = 'locationId'
const colNameDept = 'departmentId'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameLoc,
      Sequelize.INTEGER
    );
    await queryInterface.addColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameDept,
      Sequelize.INTEGER
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameLo
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
