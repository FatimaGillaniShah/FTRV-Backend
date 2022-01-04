const { Model } = require('sequelize');

export default (sequelize, { INTEGER }) => {
  class UserGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Group }) {
      this.belongsTo(Group, {
        foreignKey: 'groupId',
        as: 'groups',
      });
      this.belongsTo(User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  UserGroup.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: INTEGER,
        autoIncrement: true,
      },
      userId: {
        type: INTEGER,
        allowNull: false,
      },
      groupId: {
        type: INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'UserGroup',
      timestamps: true,
    }
  );
  return UserGroup;
};
