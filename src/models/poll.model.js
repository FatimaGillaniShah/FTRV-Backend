const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING, DATE, ENUM }) => {
  class Poll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PollOption, UserPollVote }) {
      this.hasMany(PollOption, {
        foreignKey: 'pollId',
      });

      this.hasMany(UserPollVote, {
        foreignKey: 'pollId',
      });
    }
  }
  Poll.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: STRING,
      question: STRING,
      status: ENUM('active', 'inactive'),
      startDate: {
        type: DATE,
        allowNull: false,
      },
      endDate: {
        type: DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Poll',
      timestamps: true,
    }
  );
  return Poll;
};
