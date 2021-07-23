import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER, DATE }) => {
  class Job extends Model {
    static associate({ Department, Location, User }) {
      this.belongsTo(Location, {
        foreignKey: 'locationId',
        as: 'location',
      });
      this.belongsTo(Department, {
        foreignKey: 'departmentId',
        as: 'department',
      });
      this.belongsTo(User, {
        as: 'user',
        foreignKey: 'userId',
      });
    }
  }

  Job.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      title: {
        type: STRING,
        allowNull: true,
      },
      jobDescription: {
        type: STRING,
        allowNull: false,
      },
      locationId: {
        type: INTEGER,
        allowNull: false,
      },
      departmentId: {
        type: INTEGER,
        allowNull: false,
      },
      userId: {
        type: INTEGER,
        allowNull: false,
      },
      expiryDate: {
        type: DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Jobs',
      timestamps: true,
    }
  );
  return Job;
};
