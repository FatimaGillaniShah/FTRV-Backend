'use strict';
const tableName = 'Users';
module.exports = {
  up: async (queryInterface, Sequelize) => {
  return queryInterface.describeTable({
      tableName,
      schema: process.env.SCHEMA_NAME,
      })
      .then(tableDefinition => {
          if (tableDefinition.dob) return Promise.resolve();
          return queryInterface.addColumn(
              {
              tableName,
              schema: process.env.SCHEMA_NAME,
              },
              'dob',
              Sequelize.DATE
          );
      });
  },

  down: async (queryInterface) => {
      return queryInterface.describeTable({
          tableName,
          schema: process.env.SCHEMA_NAME,
          })
          .then(tableDefinition => {
              if (!tableDefinition.dob) return Promise.resolve();
              return queryInterface.removeColumn(
                  {
                      tableName,
                      schema: process.env.SCHEMA_NAME,
                  },
                  'dob'
              );
          });
  }
};
