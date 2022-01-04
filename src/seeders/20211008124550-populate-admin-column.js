import models from '../models';

const { User } = models;

export default {
  up: async () => {
    const users = await User.findAll();
    const updateUserPromises = users.map(({ id, email }) => {
      const payload = {
        isAdmin: email === 'admin@funtownrv.com',
      };
      const query = {
        where: {
          id,
        },
      };
      return User.update(payload, query);
    });
    await Promise.all(updateUserPromises);
  },

  down: async () => {
    const users = await User.findAll();
    const updateUserPromises = users.map(({ id }) => {
      const payload = {
        isAdmin: null,
      };
      const query = {
        where: {
          id,
        },
      };
      return User.update(payload, query);
    });
    await Promise.all(updateUserPromises);
  },
};
