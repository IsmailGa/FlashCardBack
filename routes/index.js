const express = require("express");
const router = express.Router();
const authRoutes = require("./authRoutes");
const deckRoutes = require("./deckRoutes");
const cardRoutes = require("./cardRoutes");
const deckRatingRoutes = require("./deckRatingRoutes");
const userCardAnswerRoutes = require("./userCardAnswerRoutes");

// Auth routes
router.use("/auth", authRoutes);

// Deck routes
router.use("/decks", deckRoutes);

// Card routes (nested under decks)
router.use("/decks/:deckId/cards", cardRoutes);

// Deck rating routes (nested under decks)
router.use("/decks/:deckId/ratings", deckRatingRoutes);

// User card answer routes (nested under decks)
router.use("/decks/:deckId", userCardAnswerRoutes);

module.exports = router; 