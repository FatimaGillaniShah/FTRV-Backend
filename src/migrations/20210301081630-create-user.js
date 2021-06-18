'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, DATEONLY, ENUM }) => {
    await queryInterface.createTable({
      tableName: 'Users',
      schema: process.env.SCHEMA_NAME,
    }, {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      firstName: {
        type: STRING,
        allowNull: false,
      },
      lastName: {
        type: STRING,
        allowNull: false,
      },
      email: {
        type: STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: STRING,
        allowNull: false,
      },
      contactNo: {
        type: STRING,
        allowNull: true,
      },
      extension: {
        type: STRING,
        allowNull: true,
      },
      title: {
        type: STRING,
        allowNull: true,
      },
      location: {
        type: STRING,
        allowNull: true,
      },
      department: {
        type: STRING,
        allowNull: true,
      },
      role: {
        type: ENUM('admin', 'user'),
      },
      status: {
        type: ENUM('active', 'inactive'),
      },
      avatar: {
        type: STRING,
      },
      joiningDate: {
        type: DATEONLY,
      },
      createdAt: {
        allowNull: false,
        type: DATE
      },
      updatedAt: {
        allowNull: false,
        type: DATE
      },
      deletedAt: {
        allowNull: true,
        type: DATE
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};
