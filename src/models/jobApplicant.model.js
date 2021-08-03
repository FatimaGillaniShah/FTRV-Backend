import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER }) => {
  class JobApplicant extends Model {
    static associate({ User, Job }) {
      this.belongsTo(User, {
        as: 'user',
        foreignKey: 'userId',
      });
      this.belongsTo(Job, {
        foreignKey: 'userId',
      });
    }
  }

  JobApplicant.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      resume: {
        type: STRING,
        allowNull: false,
      },
      note: {
        type: STRING,
        allowNull: true,
      },
      userId: {
        type: INTEGER,
        allowNull: false,
      },
      jobId: {
        type: INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'JobApplicant',
      timestamps: true,
    }
  );
  return JobApplicant;
};
