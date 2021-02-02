module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      {
        tableName: 'Users',
        schema: process.env.SCHEMA_NAME,
      },
      [
        {
          firstName: 'Dr',
          lastName: 'Danyal',
          email: 'usmanqamar189@hotmail.com',
          password: '123456',
          contactNo: '03214078115',
          role: 'admin',
          status: 'active',
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
        tableName: 'Users',
        schema: process.env.SCHEMA_NAME,
      },
      null,
      {}
    );
  },
};
