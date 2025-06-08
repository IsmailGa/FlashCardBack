"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Card extends Model {}
  Card.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        type: DataTypes.UUID,
      },
      deckId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Decks",
          key: "id",
        },
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      answer: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
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
      modelName: "Card",
    }
  );

  Card.associate = (models) => {
    Card.belongsTo(models.Deck, { foreignKey: "deckId" });
    Card.hasMany(models.UserCardAnswer, { foreignKey: "cardId" });
  };
  return Card;
};
