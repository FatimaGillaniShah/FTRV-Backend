'use strict';
const tableName = 'Users';
const colName = 'email'

module.exports = {
  up: async (queryInterface, { CITEXT }) => {
    // enable citext extension
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS citext;');
    await queryInterface.changeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colName, {
      type: CITEXT,
      }
    );
  },

  down: async (queryInterface, { TEXT }) => {
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS citext;');
    await queryInterface.changeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colName,{
        type: TEXT,
      }
    );
  }
};
