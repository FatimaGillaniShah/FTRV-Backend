const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING, DATE, ENUM }) => {
  class Poll extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ PollOption, UserPollVote, User }) {
      this.hasMany(PollOption, {
        foreignKey: 'pollId',
      });

      this.hasMany(UserPollVote, {
        foreignKey: 'pollId',
      });
      this.belongsTo(User, {
        foreignKey: 'createdBy',
        as: 'createdByUser',
      });
      this.belongsTo(User, {
        foreignKey: 'updatedBy',
        as: 'updatedByUser',
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
      createdBy: {
        type: INTEGER,
        allowNull: false,
      },
      updatedBy: {
        type: INTEGER,
        allowNull: true,
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
