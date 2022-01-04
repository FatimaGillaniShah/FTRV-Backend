const { features } = require('../utils/constants');

module.exports = {
  up: async (queryInterface) => {
    const resources = features.map((resource) => {
      const resourceObj = {
        ...resource,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return resourceObj;
    });
    await queryInterface.bulkInsert(
      {
        tableName: 'Resources',
        schema: process.env.SCHEMA_NAME,
      },
      resources,
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete(
      {
        tableName: 'Resources',
        schema: process.env.SCHEMA_NAME,
      },
      null,
      {}
    );
  },
};
