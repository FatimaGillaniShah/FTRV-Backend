const { Model } = require('sequelize');

export default (sequelize, { INTEGER, ARRAY, STRING }) => {
  class GroupPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Group, Resource }) {
      this.belongsTo(Group, {
        foreignKey: 'groupId',
      });
      this.belongsTo(Resource, {
        foreignKey: 'resourceId',
      });
    }
  }
  GroupPermission.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      groupId: {
        type: INTEGER,
        allowNull: false,
      },
      resourceId: {
        type: INTEGER,
        allowNull: false,
      },
      permission: {
        type: ARRAY(STRING),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'GroupPermission',
      timestamps: true,
    }
  );
  return GroupPermission;
};
