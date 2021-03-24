const { Model } = require('sequelize');

export default (sequelize, { STRING, INTEGER, JSON }) => {
  class Content extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate() {
      // define association here
    }
  }
  Content.init(
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
      data: {
        type: JSON,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Content',
    }
  );
  return Content;
};
