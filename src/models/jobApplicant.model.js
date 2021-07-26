import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER }) => {
  class JobApplicant extends Model {}

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
    },
    {
      sequelize,
      modelName: 'JobApplicant',
      timestamps: true,
    }
  );
  return JobApplicant;
};
