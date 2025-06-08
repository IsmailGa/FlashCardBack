const express = require("express");
const router = express.Router({ mergeParams: true }); // To access deckId from parent route
const { verifyToken } = require("../middleware/authMiddleware");
const {
  submitAnswer,
  getUserAnswer,
  getDeckAnswers,
} = require("../controllers/userCardAnswerController");

// Get all answers for a deck
router.get("/", verifyToken, getDeckAnswers);

// Submit an answer for a card
router.post("/cards/:cardId/answer", verifyToken, submitAnswer);

// Get user's answer for a specific card
router.get("/cards/:cardId/answer", verifyToken, getUserAnswer);

module.exports = router; 