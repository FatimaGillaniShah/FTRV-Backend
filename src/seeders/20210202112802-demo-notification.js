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
          text: 'Dummy  description. Dummy  description.',
          status: 'active',
          startTime: new Date(),
          endTime: '2021-04-01',
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
