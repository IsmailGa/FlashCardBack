const db = require("../models");
const Card = db.Card;
const Deck = db.Deck;

// Create a new card
const createCard = async (req, res) => {
  try {
    const { deckId } = req.params;
    const { question, answer } = req.body;
    const userId = req.user.id;

    if (!question || !answer) {
      return res.status(400).json({
        status: "error",
        message: "Required fields: question, answer",
      });
    }

    // Verify that the deck belongs to the user
    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    const card = await Card.create({
      question,
      answer,
      deckId,
    });

    return res.status(201).json({
      status: "success",
      data: card,
    });
  } catch (error) {
    console.error("Failed to create card:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to create card",
      error: error.message,
    });
  }
};

// Get all cards in a deck
const getDeckCards = async (req, res) => {
  try {
    const { deckId } = req.params;
    const userId = req.user.id;

    // Verify that the deck belongs to the user
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
    });

    return res.status(200).json({
      status: "success",
      data: cards,
    });
  } catch (error) {
    console.error("Failed to get cards:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get cards",
      error: error.message,
    });
  }
};

// Get a specific card
const getCard = async (req, res) => {
  try {
    const { deckId, cardId } = req.params;
    const userId = req.user.id;

    // Verify that the deck belongs to the user
    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    const card = await Card.findOne({
      where: { id: cardId, deckId },
    });

    if (!card) {
      return res.status(404).json({
        status: "error",
        message: "Card not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: card,
    });
  } catch (error) {
    console.error("Failed to get card:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get card",
      error: error.message,
    });
  }
};

// Update a card
const updateCard = async (req, res) => {
  try {
    const { deckId, cardId } = req.params;
    const { question, answer } = req.body;
    const userId = req.user.id;

    // Verify that the deck belongs to the user
    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    const card = await Card.findOne({
      where: { id: cardId, deckId },
    });

    if (!card) {
      return res.status(404).json({
        status: "error",
        message: "Card not found",
      });
    }

    await card.update({
      question: question || card.question,
      answer: answer || card.answer,
    });

    return res.status(200).json({
      status: "success",
      data: card,
    });
  } catch (error) {
    console.error("Failed to update card:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to update card",
      error: error.message,
    });
  }
};

// Delete a card
const deleteCard = async (req, res) => {
  try {
    const { deckId, cardId } = req.params;
    const userId = req.user.id;

    // Verify that the deck belongs to the user
    const deck = await Deck.findOne({
      where: { id: deckId, userId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    const card = await Card.findOne({
      where: { id: cardId, deckId },
    });

    if (!card) {
      return res.status(404).json({
        status: "error",
        message: "Card not found",
      });
    }

    await card.destroy();

    return res.status(200).json({
      status: "success",
      message: "Card deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete card:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete card",
      error: error.message,
    });
  }
};

module.exports = {
  createCard,
  getDeckCards,
  getCard,
  updateCard,
  deleteCard,
};
