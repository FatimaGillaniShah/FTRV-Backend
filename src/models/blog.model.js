const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING, TEXT }) => {
  class Blog extends Model {}
  Blog.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      title: STRING,
      userId: INTEGER,
      content: TEXT,
      shortText: STRING,
    },
    {
      sequelize,
      modelName: 'Blog',
    }
  );
  return Blog;
};
