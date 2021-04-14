const { Model } = require('sequelize');

export default (sequelize, { INTEGER }) => {
  class UserPollVote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Poll, PollOption, User }) {
      this.belongsTo(Poll, {
        foreignKey: 'pollId',
      });
      this.belongsTo(PollOption, {
        foreignKey: 'pollOptionId',
      });
      this.belongsTo(User, {
        foreignKey: 'userId',
      });
    }
  }
  UserPollVote.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
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
