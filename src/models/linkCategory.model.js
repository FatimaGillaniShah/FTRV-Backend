import { Model } from 'sequelize';

export default (sequelize, { STRING, INTEGER }) => {
  class LinkCategory extends Model {
    static associate({ UsefulLink }) {
      this.hasMany(UsefulLink, {
        foreignKey: 'categoryId',
      });
    }
  }
  LinkCategory.init(
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
      modelName: 'LinkCategory',
      timestamps: true,
    }
  );
  return LinkCategory;
};
