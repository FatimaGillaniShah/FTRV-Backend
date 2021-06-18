'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, DATE }) => {
    await queryInterface.createTable({
      tableName: 'UserPollVotes',
      schema: process.env.SCHEMA_NAME
    }, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: INTEGER
      },
      userId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      pollId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'Polls',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      pollOptionId: {
        type: INTEGER,
        allowNull: false,
        references: {
          model: 'PollOptions',
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
    await queryInterface.dropTable('UserPollVotes');
  }
};
