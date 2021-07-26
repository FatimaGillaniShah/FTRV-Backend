import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER }) => {
  class Applicant extends Model {}

  Applicant.init(
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
      modelName: 'Applicant',
      timestamps: true,
    }
  );
  return Applicant;
};
