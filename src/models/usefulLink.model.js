const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class UsefulLink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ LinkCategory }) {
      this.belongsTo(LinkCategory, {
        foreignKey: 'categoryId',
      });
    }
  }

  UsefulLink.init(
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
      url: {
        type: STRING,
        allowNull: false,
      },
      categoryId: {
        type: INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UsefulLink',
      paranoid: true,
      timestamps: true,
    }
  );
  return UsefulLink;
};
