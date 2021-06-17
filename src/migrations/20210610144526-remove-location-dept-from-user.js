'use strict';
const tableName = 'Users';
const colNameLoc = 'location'
const colNameDept = 'department'

module.exports = {
  up: async (queryInterface, { STRING }) => {
    await queryInterface.removeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME
      },
      colNameLoc,
      STRING
    );
    await queryInterface.removeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME
      },
      colNameDept,
      STRING
    )
  },
  down: async (queryInterface, { STRING }) => {
    await queryInterface.addColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME
      },
      colNameLoc,
      STRING
    );
    await queryInterface.addColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME
      },
      colNameDept,
      STRING
    )
  }
};
