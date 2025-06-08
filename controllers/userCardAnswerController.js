const db = require("../models");
const UserCardAnswer = db.UserCardAnswer;
const Card = db.Card;
const Deck = db.Deck;
const { Op } = require("sequelize");
const sequelize = require("sequelize");

// Submit an answer for a card
const submitAnswer = async (req, res) => {
  try {
    const { deckId, cardId } = req.params;
    const { userAnswer } = req.body;
    const userId = req.user.id;

    if (!userAnswer) {
      return res.status(400).json({
        status: "error",
        message: "User answer is required",
      });
    }

    // Verify that the deck exists and belongs to the user
    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    // Verify that the card exists in the deck
    const card = await Card.findOne({
      where: { id: cardId, deckId },
    });

    if (!card) {
      return res.status(404).json({
        status: "error",
        message: "Card not found",
      });
    }

    // Check if the answer is correct
    const isCorrect = userAnswer.toLowerCase().trim() === card.answer.toLowerCase().trim();

    // Create or update the user's answer
    const [userCardAnswer, created] = await UserCardAnswer.findOrCreate({
      where: { cardId, userId },
      defaults: { userAnswer, isCorrect },
    });

    if (!created) {
      await userCardAnswer.update({ userAnswer, isCorrect });
    }

    return res.status(200).json({
      status: "success",
      data: {
        ...userCardAnswer.toJSON(),
        correctAnswer: card.answer,
      },
    });
  } catch (error) {
    console.error("Failed to submit answer:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to submit answer",
      error: error.message,
    });
  }
};

// Get user's answer for a card
const getUserAnswer = async (req, res) => {
  try {
    const { deckId, cardId } = req.params;
    const userId = req.user.id;

    // Verify that the deck exists and belongs to the user
    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    // Verify that the card exists in the deck
    const card = await Card.findOne({
      where: { id: cardId, deckId },
    });

    if (!card) {
      return res.status(404).json({
        status: "error",
        message: "Card not found",
      });
    }

    const userAnswer = await UserCardAnswer.findOne({
      where: { cardId, userId },
    });

    return res.status(200).json({
      status: "success",
      data: userAnswer || null,
    });
  } catch (error) {
    console.error("Failed to get user answer:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get user answer",
      error: error.message,
    });
  }
};

// Get all user's answers for a deck
const getDeckAnswers = async (req, res) => {
  try {
    const { deckId } = req.params;
    const userId = req.user.id;

    // Verify that the deck exists and belongs to the user
    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    const cards = await Card.findAll({
      where: { deckId },
      include: [
        {
          model: UserCardAnswer,
          where: { userId },
          required: false,
        },
      ],
    });

    // Calculate statistics
    const totalCards = cards.length;
    const answeredCards = cards.filter(card => card.UserCardAnswer).length;
    const correctAnswers = cards.filter(
      card => card.UserCardAnswer && card.UserCardAnswer.isCorrect
    ).length;

    return res.status(200).json({
      status: "success",
      data: {
        cards,
        statistics: {
          totalCards,
          answeredCards,
          correctAnswers,
          accuracy: answeredCards ? (correctAnswers / answeredCards) * 100 : 0,
        },
      },
    });
  } catch (error) {
    console.error("Failed to get deck answers:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get deck answers",
      error: error.message,
    });
  }
};

// Get user's answer statistics and history
const getUserAnswerStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeRange } = req.query; // Optional: 'day', 'week', 'month', 'all'

    // Set date range based on timeRange parameter
    let dateFilter = {};
    if (timeRange) {
      const now = new Date();
      switch (timeRange) {
        case 'day':
          dateFilter = {
            createdAt: {
              [Op.gte]: new Date(now.setDate(now.getDate() - 1))
            }
          };
          break;
        case 'week':
          dateFilter = {
            createdAt: {
              [Op.gte]: new Date(now.setDate(now.getDate() - 7))
            }
          };
          break;
        case 'month':
          dateFilter = {
            createdAt: {
              [Op.gte]: new Date(now.setMonth(now.getMonth() - 1))
            }
          };
          break;
      }
    }

    // Get overall statistics
    const overallStats = await UserCardAnswer.findAll({
      where: {
        userId,
        ...dateFilter
      },
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAnswers'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN "isCorrect" THEN 1 ELSE 0 END')), 'correctAnswers'],
        [sequelize.fn('AVG', sequelize.literal('CASE WHEN "isCorrect" THEN 1 ELSE 0 END')), 'accuracy']
      ]
    });

    // Get deck-wise statistics
    const deckStats = await UserCardAnswer.findAll({
      where: {
        userId,
        ...dateFilter
      },
      include: [{
        model: Card,
        include: [{
          model: Deck,
          attributes: ['id', 'title']
        }]
      }],
      attributes: [
        [sequelize.col('Card.Deck.id'), 'deckId'],
        [sequelize.col('Card.Deck.title'), 'deckTitle'],
        [sequelize.fn('COUNT', sequelize.col('UserCardAnswer.id')), 'totalAnswers'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN "UserCardAnswer"."isCorrect" THEN 1 ELSE 0 END')), 'correctAnswers'],
        [sequelize.fn('AVG', sequelize.literal('CASE WHEN "UserCardAnswer"."isCorrect" THEN 1 ELSE 0 END')), 'accuracy']
      ],
      group: ['Card.Deck.id', 'Card.Deck.title']
    });

    // Get daily progress
    const dailyProgress = await UserCardAnswer.findAll({
      where: {
        userId,
        ...dateFilter
      },
      attributes: [
        [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'totalAnswers'],
        [sequelize.fn('SUM', sequelize.literal('CASE WHEN "isCorrect" THEN 1 ELSE 0 END')), 'correctAnswers'],
        [sequelize.fn('AVG', sequelize.literal('CASE WHEN "isCorrect" THEN 1 ELSE 0 END')), 'accuracy']
      ],
      group: [sequelize.fn('date_trunc', 'day', sequelize.col('createdAt'))],
      order: [[sequelize.fn('date_trunc', 'day', sequelize.col('createdAt')), 'DESC']]
    });

    // Get recent answers
    const recentAnswers = await UserCardAnswer.findAll({
      where: {
        userId,
        ...dateFilter
      },
      include: [{
        model: Card,
        include: [{
          model: Deck,
          attributes: ['id', 'title']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    return res.status(200).json({
      status: "success",
      data: {
        overall: {
          totalAnswers: parseInt(overallStats[0].getDataValue('totalAnswers')) || 0,
          correctAnswers: parseInt(overallStats[0].getDataValue('correctAnswers')) || 0,
          accuracy: parseFloat(overallStats[0].getDataValue('accuracy') * 100) || 0
        },
        byDeck: deckStats.map(stat => ({
          deckId: stat.getDataValue('deckId'),
          deckTitle: stat.getDataValue('deckTitle'),
          totalAnswers: parseInt(stat.getDataValue('totalAnswers')) || 0,
          correctAnswers: parseInt(stat.getDataValue('correctAnswers')) || 0,
          accuracy: parseFloat(stat.getDataValue('accuracy') * 100) || 0
        })),
        dailyProgress: dailyProgress.map(day => ({
          date: day.getDataValue('date'),
          totalAnswers: parseInt(day.getDataValue('totalAnswers')) || 0,
          correctAnswers: parseInt(day.getDataValue('correctAnswers')) || 0,
          accuracy: parseFloat(day.getDataValue('accuracy') * 100) || 0
        })),
        recentAnswers: recentAnswers.map(answer => ({
          id: answer.id,
          userAnswer: answer.userAnswer,
          isCorrect: answer.isCorrect,
          createdAt: answer.createdAt,
          deck: {
            id: answer.Card.Deck.id,
            title: answer.Card.Deck.title
          },
          card: {
            id: answer.Card.id,
            question: answer.Card.question
          }
        }))
      }
    });
  } catch (error) {
    console.error("Failed to get user answer statistics:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get user answer statistics",
      error: error.message
    });
  }
};

module.exports = {
  submitAnswer,
  getUserAnswer,
  getDeckAnswers,
  getUserAnswerStats
}; 