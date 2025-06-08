const db = require("../models");
const Deck = db.Deck;
const Card = db.Card;

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
          { isPublic: true } // Public decks from other users
        ]
      },
      include: [
        {
          model: Card,
          attributes: ["id"], // Only include card IDs to count them
        },
      ],
    });

    // Add card count to each deck
    const decksWithCardCount = decks.map(deck => ({
      ...deck.toJSON(),
      cardCount: deck.Cards.length,
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
    const decksWithCardCount = decks.map(deck => ({
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

module.exports = {
  createDeck,
  getUserDecks,
  getUserOwnDecks,
  getDeck,
  updateDeck,
  deleteDeck,
}; 