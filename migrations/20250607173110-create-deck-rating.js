"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("DeckRatings", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      isLike: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      deckId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Decks",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add unique constraint to prevent multiple ratings from the same user for the same deck
    await queryInterface.addIndex("DeckRatings", ["deckId", "userId"], {
      unique: true,
      name: "deck_ratings_unique_user_deck",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("DeckRatings");
  },
}; 