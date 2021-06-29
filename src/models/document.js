const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Department }) {
      this.belongsTo(Department, {
        foreignKey: 'departmentId',
        as: 'department',
      });
    }
  }
  Document.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: STRING,
      description: STRING,
      url: STRING,
      departmentId: {
        type: INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Document',
      timestamps: true,
    }
  );
  return Document;
};
