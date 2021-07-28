const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Document, RingGroup, Job }) {
      this.hasMany(User, {
        as: 'users',
        foreignKey: 'departmentId',
      });
      this.hasMany(Document, {
        as: 'documents',
        foreignKey: 'departmentId',
      });
      this.hasMany(RingGroup, {
        as: 'ringGroups',
        foreignKey: 'departmentId',
      });
      this.hasMany(Job, {
        as: 'jobs',
        foreignKey: 'departmentId',
      });
    }
  }
  Department.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: STRING,
    },
    {
      sequelize,
      modelName: 'Department',
    }
  );
  return Department;
};
