const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class Department extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Document }) {
      this.hasMany(User, {
        as: 'users',
        foreignKey: 'departmentId',
      });
      this.hasMany(Document, {
        as: 'documents',
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
