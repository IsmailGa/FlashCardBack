"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeckRating extends Model {
    static associate(models) {
      DeckRating.belongsTo(models.Deck, { foreignKey: "deckId" });
      DeckRating.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  DeckRating.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      isLike: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      deckId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Decks",
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
      modelName: "DeckRating",
      timestamps: true,
    }
  );
  return DeckRating;
};
