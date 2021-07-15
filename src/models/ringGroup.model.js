import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER }) => {
  class RingGroup extends Model {
    static associate({ Department, Location }) {
      this.belongsTo(Location, {
        foreignKey: 'locationId',
        as: 'location',
      });
      this.belongsTo(Department, {
        foreignKey: 'departmentId',
        as: 'department',
      });
    }
  }

  RingGroup.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: {
        type: STRING,
        allowNull: false,
      },
      extension: {
        type: STRING,
        allowNull: true,
      },
      locationId: {
        type: INTEGER,
        allowNull: true,
      },
      departmentId: {
        type: INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'RingGroup',
      timestamps: true,
    }
  );
  return RingGroup;
};
