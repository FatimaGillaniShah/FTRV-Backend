import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER, DATE }) => {
  class Job extends Model {
    static associate({ Department, Location, User, JobApplicant }) {
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
      this.hasMany(JobApplicant, {
        foreignKey: 'jobId',
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
        allowNull: false,
      },
      description: {
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
      modelName: 'Job',
      timestamps: true,
    }
  );
  return Job;
};
