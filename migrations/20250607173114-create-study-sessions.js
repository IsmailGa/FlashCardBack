'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('StudySessions', {
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
      startTime: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      endTime: {
        type: Sequelize.DATE,
        allowNull: true
      },
      currentCardIndex: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      isCompleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      totalCards: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      correctAnswers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      incorrectAnswers: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      sessionProgress: {
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
    await queryInterface.dropTable('StudySessions');
  }
}; 