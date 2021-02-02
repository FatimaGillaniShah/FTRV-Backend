export default (sequelize, { INTEGER }) => {
  const AnnouncementUserStatus = sequelize.define(
    'AnnouncementUserStatus',
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
      notificationId: {
        type: INTEGER,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      timestamps: true,
    },
    {
      indexes: [
        {
          unique: true,
          fields: ['userId'],
        },
      ],
    }
  );

  // associate a role to user
  // User.associate = function (models) {
  // 	models.User.belongsTo(models.Role, {foreignKey: 'roleId'});
  // };

  return AnnouncementUserStatus;
};
