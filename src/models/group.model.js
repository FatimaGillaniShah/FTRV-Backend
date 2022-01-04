const { Model } = require('sequelize');

export default (sequelize, { INTEGER, CITEXT, TEXT }) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, UserGroup, Resource, GroupPermission }) {
      this.belongsTo(User, {
        foreignKey: 'createdBy',
        as: 'createdByUser',
      });
      this.belongsTo(User, {
        foreignKey: 'updatedBy',
        as: 'updatedByUser',
      });
      this.belongsToMany(User, {
        through: UserGroup,
        foreignKey: 'groupId',
        otherKey: 'userId',
      });
      this.belongsToMany(Resource, {
        through: GroupPermission,
        foreignKey: 'groupId',
        otherKey: 'resourceId',
        as: 'resources',
      });
    }
  }
  Group.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      name: {
        type: CITEXT,
        allowNull: false,
        unique: true,
      },
      description: {
        type: TEXT,
        allowNull: true,
      },
      createdBy: {
        type: INTEGER,
        allowNull: false,
      },
      updatedBy: {
        type: INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Group',
      timestamps: true,
    }
  );
  return Group;
};
