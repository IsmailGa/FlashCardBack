const db = require("../models");
const UserCardAnswer = db.UserCardAnswer;
const Card = db.Card;
const Deck = db.Deck;

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

module.exports = {
  submitAnswer,
  getUserAnswer,
  getDeckAnswers,
}; 