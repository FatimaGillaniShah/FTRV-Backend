const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class PollOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Poll, UserPollVote }) {
      this.belongsTo(Poll, {
        foreignKey: 'pollId',
      });
      this.hasMany(UserPollVote, {
        foreignKey: 'pollOptionId',
        as: 'voted',
      });
    }
  }
  PollOption.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: STRING,
      pollId: INTEGER,
      votes: {
        type: INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'PollOption',
      timestamps: true,
    }
  );
  return PollOption;
};
