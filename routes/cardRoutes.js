const express = require("express");
const router = express.Router({ mergeParams: true }); // To access deckId from parent route
const { verifyToken } = require("../middleware/authMiddleware");
const {
  createCard,
  getDeckCards,
  getCard,
  updateCard,
  deleteCard,
} = require("../controllers/cardController");

// Get all cards in a deck
router.get("/", verifyToken, getDeckCards);

// Get a specific card
router.get("/:cardId", verifyToken, getCard);

// Create a new card
router.post("/", verifyToken, createCard);

// Update a card
router.put("/:cardId", verifyToken, updateCard);

// Delete a card
router.delete("/:cardId", verifyToken, deleteCard);

module.exports = router; 