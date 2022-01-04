'use strict';
const tableNames = ['Announcements', 'Events', 'Documents', 'Jobs', 'Groups', 'Resources']

const colName = 'description'

module.exports = {
  up: async (queryInterface, { TEXT }) => {
    tableNames.map(async(tableName) => {
      await queryInterface.changeColumn(
        {
          tableName,
          schema: process.env.SCHEMA_NAME,
        },
        colName, {
        type: TEXT,
      }
      );
    })
  },

  down: async (queryInterface, { STRING }) => {
    tableNames.map(async (tableName) => {
      await queryInterface.changeColumn(
        {
          tableName,
          schema: process.env.SCHEMA_NAME,
        },
        colName, {
        type: STRING,
      }
      );
    })
  }
};
