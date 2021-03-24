export default {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      {
        tableName: 'Contents',
        schema: process.env.SCHEMA_NAME,
      },
      [
        {
          name: 'QUOTE',
          data: JSON.stringify({ quote: '' }),
          createdAt: '2020-01-01T00:00:00.000Z',
          updatedAt: '2020-01-01T00:00:00.000Z',
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      {
        tableName: 'Contents',
        schema: process.env.SCHEMA_NAME,
      },
      null,
      {}
    );
  },
};
