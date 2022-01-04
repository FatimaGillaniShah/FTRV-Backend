'use strict';
import models from '../models';
const tableName = 'Users';
const colName = 'isAdmin';

const { User } = models;

module.exports = {
  up: async (queryInterface, { BOOLEAN }) => {
    await queryInterface.addColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colName, {
      type: BOOLEAN,
      default: false
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colName
    );
  }
};
