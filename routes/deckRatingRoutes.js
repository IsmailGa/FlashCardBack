const express = require("express");
const router = express.Router({ mergeParams: true }); // To access deckId from parent route
const { verifyToken } = require("../middleware/authMiddleware");
const {
  rateDeck,
  getDeckRatings,
  getUserRating,
  deleteDeckRating,
} = require("../controllers/deckRatingController");

// Get all ratings for a deck
router.get("/", verifyToken, getDeckRatings);

// Get user's rating for a deck
router.get("/my-rating", verifyToken, getUserRating);

// Rate a deck (like/dislike)
router.post("/", verifyToken, rateDeck);

// Delete user's rating
router.delete("/", verifyToken, deleteDeckRating);

module.exports = router; 