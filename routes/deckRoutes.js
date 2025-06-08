const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createDeck,
  getUserDecks,
  getUserOwnDecks,
  getDeck,
  updateDeck,
  deleteDeck,
} = require("../controllers/deckController");

// Get all decks (public and user's private decks)
router.get("/", verifyToken, getUserDecks);

// Get user's own decks only
router.get("/my-decks", verifyToken, getUserOwnDecks);

// Get a specific deck
router.get("/:deckId", verifyToken, getDeck);

// Create a new deck
router.post("/", verifyToken, createDeck);

// Update a deck
router.put("/:deckId", verifyToken, updateDeck);

// Delete a deck
router.delete("/:deckId", verifyToken, deleteDeck);

module.exports = router; 