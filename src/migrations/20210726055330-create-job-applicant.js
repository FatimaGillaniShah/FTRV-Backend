'use strict';
module.exports = {
  up: async (queryInterface, { INTEGER, STRING, DATE, TEXT }) => {
    await queryInterface.createTable({
          tableName: 'JobApplicants',
          schema: process.env.SCHEMA_NAME,
        },
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: INTEGER,
            autoIncrement: true,
          },
          resume: {
            type: STRING,
            allowNull: false,
          },
          note: {
            type: TEXT,
            allowNull: true,
          },
          userId: {
            type: INTEGER,
            allowNull: false,
            references: {
              model: 'Users',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          jobId: {
            type: INTEGER,
            allowNull: false,
            references: {
              model: 'Jobs',
              key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE'
          },
          createdAt: {
            allowNull: false,
            type: DATE
          },
          updatedAt: {
            allowNull: false,
            type: DATE
          },
        },{
          uniqueKeys: {
            Items_unique: {
                fields: ['userId', 'jobId']
            }
        }
        }
      );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('JobApplicants');
  }
};
