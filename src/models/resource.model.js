const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING, VIRTUAL, TEXT }) => {
  class Resource extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Group, GroupPermission }) {
      this.belongsToMany(Group, {
        through: GroupPermission,
        foreignKey: 'resourceId',
        otherKey: 'groupId',
      });
    }
  }
  Resource.init(
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
      description: {
        type: TEXT,
        allowNull: true,
      },
      slug: {
        type: STRING,
        allowNull: false,
      },
      permissions: {
        type: VIRTUAL,
      },
    },
    {
      sequelize,
      modelName: 'Resource',
      timestamps: true,
    }
  );
  return Resource;
};
