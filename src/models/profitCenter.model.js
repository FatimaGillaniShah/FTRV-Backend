const { Model } = require('sequelize');

export default (sequelize, { INTEGER, STRING }) => {
  class ProfitCenter extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User }) {
      this.belongsTo(User, {
        foreignKey: 'userId',
      });
    }
  }
  ProfitCenter.init(
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
      userId: {
        type: INTEGER,
        allowNull: true,
      },
      address: {
        type: STRING,
        allowNull: false,
      },
      code: {
        type: STRING,
        allowNull: false,
      },
      faxNumber: {
        type: INTEGER,
        allowNull: true,
      },
      contactNo: {
        type: STRING,
        allowNull: false,
      },
      centerNumber: {
        type: INTEGER,
        allowNull: false,
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
      modelName: 'ProfitCenter',
      timestamps: true,
    }
  );
  return ProfitCenter;
};
