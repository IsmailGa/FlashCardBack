const db = require("../models");
const {
  Deck,
  Card,
  UserCardAnswer,
  User,
  UserCardProgress,
} = require("../models");
const { Op } = require("sequelize");
const sequelize = require("sequelize");

// Create a new deck
const createDeck = async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;
    const userId = req.user.id;

    if (!title || !description) {
      return res.status(400).json({
        status: "error",
        message: "Required fields: title, description",
      });
    }

    const deck = await Deck.create({
      title,
      description,
      isPublic: isPublic || false,
      userId,
    });

    return res.status(201).json({
      status: "success",
      data: deck,
    });
  } catch (error) {
    console.error("Failed to create deck:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create deck",
      error: error.message,
    });
  }
};

// Get all decks for a user
const getUserDecks = async (req, res) => {
  try {
    const userId = req.user.id;
    const decks = await Deck.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { userId }, // User's own decks
          { isPublic: true }, // Public decks from other users
        ],
      },
      include: [
        {
          model: Card,
          attributes: ["id"], // Only include card IDs to count them
        },
        {
          model: User,
          attributes: ["id", "userName", "fullName"],
        },
      ],
    });

    // Add card count to each deck
    const decksWithCardCount = decks.map((deck) => ({
      ...deck.toJSON(),
      cardCount: deck.Cards.length,
      author: {
        id: deck.User.id,
        userName: deck.User.userName,
        fullName: deck.User.fullName,
      },
    }));

    return res.status(200).json({
      status: "success",
      data: decksWithCardCount,
    });
  } catch (error) {
    console.error("Failed to get decks:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get decks",
      error: error.message,
    });
  }
};

// Get user's own decks only
const getUserOwnDecks = async (req, res) => {
  try {
    const userId = req.user.id;
    const decks = await Deck.findAll({
      where: { userId },
      include: [
        {
          model: Card,
          attributes: ["id"], // Only include card IDs to count them
        },
      ],
    });

    // Add card count to each deck
    const decksWithCardCount = decks.map((deck) => ({
      ...deck.toJSON(),
      cardCount: deck.Cards.length,
    }));

    return res.status(200).json({
      status: "success",
      data: decksWithCardCount,
    });
  } catch (error) {
    console.error("Failed to get user's decks:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get user's decks",
      error: error.message,
    });
  }
};

// Get a single deck with its cards
const getDeck = async (req, res) => {
  try {
    const { deckId } = req.params;
    const userId = req.user.id;

    const deck = await Deck.findOne({
      where: { id: deckId, userId },
      include: [
        {
          model: Card,
          attributes: ["id", "question", "answer"],
        },
        {
          model: User,
          attributes: ["id", "fullName", "userName"],
        },
      ],
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: deck,
    });
  } catch (error) {
    console.error("Failed to get deck:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get deck",
      error: error.message,
    });
  }
};

// Update a deck
const updateDeck = async (req, res) => {
  try {
    const { deckId } = req.params;
    const { name, sourceLanguage, targetLanguage } = req.body;
    const userId = req.user.id;

    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    await deck.update({
      name: name || deck.name,
      sourceLanguage: sourceLanguage || deck.sourceLanguage,
      targetLanguage: targetLanguage || deck.targetLanguage,
    });

    return res.status(200).json({
      status: "success",
      data: deck,
    });
  } catch (error) {
    console.error("Failed to update deck:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update deck",
      error: error.message,
    });
  }
};

// Delete a deck
const deleteDeck = async (req, res) => {
  try {
    const { deckId } = req.params;
    const userId = req.user.id;

    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    await deck.destroy();

    return res.status(200).json({
      status: "success",
      message: "Deck deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete deck:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete deck",
      error: error.message,
    });
  }
};

// Get recently played decks
const getRecentDecks = async (req, res) => {
  try {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit) || 5; // Default to 5 recent decks

    // Get unique decks that the user has answered cards from
    const recentDecks = await Deck.findAll({
      include: [
        {
          model: Card,
          include: [
            {
              model: UserCardAnswer,
              where: { userId },
              required: true,
              attributes: ["createdAt"],
            },
          ],
          required: true,
        },
      ],
      attributes: [
        "id",
        "title",
        "description",
        "createdAt",
        "updatedAt",
        [
          sequelize.fn("MAX", sequelize.col("Cards.UserCardAnswers.createdAt")),
          "lastPlayedAt",
        ],
      ],
      group: ["Deck.id"],
      order: [[sequelize.literal("lastPlayedAt"), "DESC"]],
      limit,
    });

    // Format the response
    const formattedDecks = recentDecks.map((deck) => ({
      id: deck.id,
      title: deck.title,
      description: deck.description,
      lastPlayedAt: deck.getDataValue("lastPlayedAt"),
      createdAt: deck.createdAt,
      updatedAt: deck.updatedAt,
    }));

    res.json({
      message: "Recent decks retrieved successfully",
      decks: formattedDecks,
    });
  } catch (error) {
    console.error("Error getting recent decks:", error);
    res.status(500).json({ message: "Error retrieving recent decks" });
  }
};

// Search decks
const searchDecks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        status: "error",
        message: "Search query is required",
      });
    }

    const decks = await Deck.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${query}%` } },
          { description: { [Op.iLike]: `%${query}%` } },
        ],
        [Op.or]: [
          { userId }, // User's own decks
          { isPublic: true }, // Public decks from other users
        ],
      },
      include: [
        {
          model: Card,
          attributes: ["id"], // Only include card IDs to count them
        },
        {
          model: User,
          attributes: ["id", "userName", "fullName"], // Include author's username
        },
      ],
    });

    // Add card count to each deck
    const decksWithCardCount = decks.map((deck) => ({
      ...deck.toJSON(),
      cardCount: deck.Cards.length,
      author: {
        id: deck.User.id,
        userName: deck.User.userName,
        fullName: deck.User.fullName,
      },
    }));

    return res.status(200).json({
      status: "success",
      data: decksWithCardCount,
    });
  } catch (error) {
    console.error("Failed to search decks:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to search decks",
      error: error.message,
    });
  }
};

// Get another user's public decks
const getUserPublicDecks = async (req, res) => {
  try {
    const { userId } = req.params;

    // Verify that the user exists
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const decks = await Deck.findAll({
      where: {
        userId,
        isPublic: true,
      },
      include: [
        {
          model: Card,
          attributes: ["id"], // Only include card IDs to count them
        },
        {
          model: User,
          attributes: ["id", "userName", "fullName"],
        },
      ],
    });

    // Add card count to each deck
    const decksWithCardCount = decks.map((deck) => ({
      ...deck.toJSON(),
      cardCount: deck.Cards.length,
      author: {
        id: deck.User.id,
        userName: deck.User.userName,
        fullName: deck.User.fullName,
      },
    }));

    return res.status(200).json({
      status: "success",
      data: decksWithCardCount,
    });
  } catch (error) {
    console.error("Failed to get user's public decks:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get user's public decks",
      error: error.message,
    });
  }
};

// Update card progress
const updateCardProgress = async (req, res) => {
  try {
    const { deckId, cardId } = req.params;
    const { isCorrect } = req.body;
    const userId = req.user.id;

    // Verify that the deck exists and belongs to the user
    const deck = await Deck.findOne({
      where: { id: deckId },
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

    // Find or create user's card progress
    const [progress, created] = await UserCardProgress.findOrCreate({
      where: { userId, cardId },
      defaults: {
        status: isCorrect ? "know" : "learning",
        nextReview: new Date(
          Date.now() +
            (isCorrect ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000)
        ), // 7 days for know, 1 day for learning
        reviewCount: 1,
      },
    });

    if (!created) {
      // Update existing progress
      const newReviewCount = progress.reviewCount + 1;
      const newStatus = isCorrect ? "know" : "learning";
      const nextReviewInterval = isCorrect
        ? 7 * 24 * 60 * 60 * 1000
        : 24 * 60 * 60 * 1000; // 7 days for know, 1 day for learning

      await progress.update({
        status: newStatus,
        nextReview: new Date(Date.now() + nextReviewInterval),
        reviewCount: newReviewCount,
      });
    }

    return res.status(200).json({
      status: "success",
      data: {
        ...progress.toJSON(),
        card: {
          id: card.id,
          question: card.question,
          answer: card.answer,
        },
      },
    });
  } catch (error) {
    console.error("Failed to update card progress:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update card progress",
      error: error.message,
    });
  }
};

module.exports = {
  createDeck,
  getUserDecks,
  getUserOwnDecks,
  getDeck,
  updateDeck,
  deleteDeck,
  getRecentDecks,
  searchDecks,
  getUserPublicDecks,
  updateCardProgress,
};
