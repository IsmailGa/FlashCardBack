'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UserCardAnswers', 'studySessionId', {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'StudySessions',
        key: 'id'
      }
    });

    await queryInterface.addColumn('UserCardAnswers', 'responseTime', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UserCardAnswers', 'studySessionId');
    await queryInterface.removeColumn('UserCardAnswers', 'responseTime');
  }
}; 