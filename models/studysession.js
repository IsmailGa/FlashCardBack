"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StudySession extends Model {
    static associate(models) {
      StudySession.belongsTo(models.User, { foreignKey: "userId" });
      StudySession.belongsTo(models.Deck, { foreignKey: "deckId" });
      StudySession.hasMany(models.UserCardAnswer, { foreignKey: "studySessionId" });
    }
  }
  StudySession.init(
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
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      currentCardIndex: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      totalCards: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      correctAnswers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      incorrectAnswers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      sessionProgress: {
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
      modelName: "StudySession",
      timestamps: true,
    }
  );
  return StudySession;
}; 