"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserCardAnswer extends Model {
    static associate(models) {
      UserCardAnswer.belongsTo(models.Card, { foreignKey: "cardId" });
      UserCardAnswer.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  UserCardAnswer.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      userAnswer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cardId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Cards",
          key: "id",
        },
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "UserCardAnswer",
      timestamps: true,
    }
  );
  return UserCardAnswer;
}; 