'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE }) => {
    await queryInterface.createTable({
          tableName: 'RingGroups',
          schema: process.env.SCHEMA_NAME,
        },
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: INTEGER
          },
          name: {
            type: STRING,
            allowNull: false,
          },
          extension: {
            type: STRING,
            allowNull: false,
          },
          departmentId: {
            type: INTEGER,
            allowNull: false,
            references: {
              model: 'Departments',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          locationId: {
            type: INTEGER,
            allowNull: false,
            references: {
              model: 'Locations',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          createdAt: {
            allowNull: false,
            type: DATE
          },
          updatedAt: {
            allowNull: false,
            type: DATE
          }
        });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RingGroups');
  }
};
