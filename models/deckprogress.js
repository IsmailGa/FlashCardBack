"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeckProgress extends Model {
    static associate(models) {
      DeckProgress.belongsTo(models.User, { foreignKey: "userId" });
      DeckProgress.belongsTo(models.Deck, { foreignKey: "deckId" });
    }
  }
  DeckProgress.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      deckId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Decks",
          key: "id",
        },
      },
      totalCards: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      masteredCards: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      lastStudiedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      totalStudyTime: {
        type: DataTypes.INTEGER, // в минутах
        allowNull: false,
        defaultValue: 0,
      },
      completionPercentage: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      totalSessions: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      averageAccuracy: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
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
      modelName: "DeckProgress",
      timestamps: true,
    }
  );
  return DeckProgress;
}; 