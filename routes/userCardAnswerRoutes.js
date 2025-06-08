const express = require("express");
const router = express.Router({ mergeParams: true }); // Enable access to parent route params
const { verifyToken } = require("../middleware/authMiddleware");
const {
  submitAnswer,
  getUserAnswer,
  getDeckAnswers,
  getUserAnswerStats
} = require("../controllers/userCardAnswerController");

// Protected routes
router.use(verifyToken);

// Get user's answer statistics
router.get("/stats", getUserAnswerStats);

// Get all answers for a deck
router.get("/deck/:deckId", getDeckAnswers);

// Get user's answer for a specific card
router.get("/deck/:deckId/card/:cardId", getUserAnswer);

// Submit an answer for a card
router.post("/deck/:deckId/card/:cardId", submitAnswer);

module.exports = router; 