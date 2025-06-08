"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("UserCardAnswers", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      userAnswer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      isCorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      cardId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Cards",
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

    // Add unique constraint to prevent multiple answers from the same user for the same card
    await queryInterface.addIndex("UserCardAnswers", ["cardId", "userId"], {
      unique: true,
      name: "user_card_answers_unique_user_card",
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("UserCardAnswers");
  },
}; 