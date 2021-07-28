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
        foreignKey: 'createdBy',
        as: 'createdByUser',
      });
      this.belongsTo(User, {
        foreignKey: 'updatedBy',
        as: 'updatedByUser',
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
      expiryDate: {
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
      modelName: 'Job',
      timestamps: true,
    }
  );
  return Job;
};
