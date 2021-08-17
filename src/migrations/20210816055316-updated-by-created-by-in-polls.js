'use strict';
const tableName = 'Polls';
const colNameCreatedBy = 'createdBy'
const colNameUpdatedBy = 'updatedBy'

module.exports = {
  up: async (queryInterface, { INTEGER }) => {
    await queryInterface.addColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameCreatedBy, {
      type: INTEGER,
      references: {
        model: 'Users',
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
      colNameUpdatedBy,{
      type: INTEGER,
      references: {
        model: 'Users',
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
      colNameCreatedBy
    );
    await queryInterface.removeColumn(
      {
        tableName,
        schema: process.env.SCHEMA_NAME,
      },
      colNameUpdatedBy
    );
  }
};
