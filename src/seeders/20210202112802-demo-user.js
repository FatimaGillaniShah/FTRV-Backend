import { generateHash } from '../utils/helper';

export default {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      {
        tableName: 'Users',
        schema: process.env.SCHEMA_NAME,
      },
      [
        {
          firstName: 'Super',
          lastName: 'Admin',
          email: 'admin@funtownrv.com',
          password: generateHash('admin@ftrv123'),
          contactNo: '1234567890',
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
