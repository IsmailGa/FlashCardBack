'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('DeckProgress', {
      id: {
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        type: Sequelize.UUID
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      deckId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Decks',
          key: 'id'
        }
      },
      totalCards: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      masteredCards: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      lastStudiedAt: {
        type: Sequelize.DATE,
        allowNull: true
      },
      totalStudyTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      completionPercentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      totalSessions: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      averageAccuracy: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('DeckProgress');
  }
}; 