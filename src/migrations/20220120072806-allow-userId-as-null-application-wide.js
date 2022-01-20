"use strict";
const tables = [
  {
    tableName: "Blogs",
    colName: "userId",
  },
  {
    tableName: "UserPollVotes",
    colName: "userId",
  },
  {
    tableName: "Jobs",
    colName: "createdBy",
  },
  {
    tableName: "ProfitCenters",
    colName: "createdBy",
  },
  {
    tableName: "Groups",
    colName: "createdBy",
  },
];

module.exports = {
  up: async (queryInterface, { INTEGER }) => {
    tables.map(async ({ tableName, colName }) => {
      await queryInterface.changeColumn(
        {
          tableName,
          schema: process.env.SCHEMA_NAME,
        },
        colName,
        {
          type: INTEGER,
          allowNull: true,
        }
      );
    });
  },

  down: async (queryInterface, { INTEGER }) => {
    tables.map(async ({ tableName, colName }) => {
      await queryInterface.changeColumn(
        {
          tableName,
          schema: process.env.SCHEMA_NAME,
        },
        colName,
        {
          type: INTEGER,
          allowNull: false,
        }
      );
    });
  },
};
