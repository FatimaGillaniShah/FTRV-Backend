const { Model } = require('sequelize');

module.exports = (sequelize, { INTEGER }) => {
  class UserPollVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Poll, PollOption }) {
      this.belongsTo(Poll, {
        foreignKey: 'pollId',
      });
      this.belongsTo(PollOption, {
        foreignKey: 'pollOptionId',
      });
    }
  }
  UserPollVote.init(
    {
      id: INTEGER,
      userId: INTEGER,
      pollId: INTEGER,
      pollOptionId: INTEGER,
    },
    {
      sequelize,
      modelName: 'UserPollVote',
    }
  );
  return UserPollVote;
};
