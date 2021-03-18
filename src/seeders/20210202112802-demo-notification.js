export default {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      {
        tableName: 'Announcements',
        schema: process.env.SCHEMA_NAME,
      },
      [
        {
          title: 'Holiday',
          description: 'This is a holiday announcement description',
          status: 'active',
          priority: 'high',
          startTime: new Date(),
          endTime: '2022-04-01',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      {
        tableName: 'Users',
        schema: process.env.SCHEMA_NAME,
      },
      null,
      {}
    );
  },
};
