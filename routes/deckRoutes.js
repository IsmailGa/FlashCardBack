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
  getRecentDecks,
  searchDecks,
  getUserPublicDecks,
  updateCardProgress
} = require("../controllers/deckController");

// Protected routes
router.use(verifyToken);

// Get recent decks
router.get("/recent", getRecentDecks);

// Search decks
router.get("/search", searchDecks);

// Get user's public decks
router.get("/user/:userId", getUserPublicDecks);

// Get all decks (public and user's private)
router.get("/", getUserDecks);

// Get user's own decks
router.get("/my-decks", getUserOwnDecks);

// Get a specific deck
router.get("/:deckId", getDeck);

// Create a new deck
router.post("/", createDeck);

// Update a deck
router.put("/:deckId", updateDeck);

// Delete a deck
router.delete("/:deckId", deleteDeck);

// Update card progress
router.post("/:deckId/cards/:cardId/progress", updateCardProgress);

module.exports = router; 