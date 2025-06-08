"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Cards", {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID,
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
      question: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      order: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Add indexes
    await queryInterface.addIndex("Cards", ["deckId"]);
    await queryInterface.addIndex("Cards", ["order"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Cards");
  },
}; 