import dotenv from 'dotenv';

dotenv.config();

const roles = [
  {
    name: 'superAdmin',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: 'user',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert({ tableName: 'Roles', schema: process.env.DB_NAME }, roles, {}),

  down: (queryInterface) =>
    queryInterface.bulkDelete({ tableName: 'Roles', schema: process.env.DB_NAME }, null, {}),
};
