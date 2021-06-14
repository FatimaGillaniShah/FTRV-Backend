'use strict';

module.exports = {
  up: async (queryInterface, { INTEGER }) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn({
      tableName: 'UsefulLinks',
      schema: process.env.SCHEMA_NAME
    },
    'categoryId', {
    type: INTEGER,
    references: {
      model: 'LinkCategories',
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT',
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn({
      tableName: 'UsefulLinks',
      schema: process.env.SCHEMA_NAME
    }, 'categoryId' )
  }
};
