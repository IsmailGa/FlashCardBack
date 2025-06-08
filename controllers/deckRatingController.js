const db = require("../models");
const DeckRating = db.DeckRating;
const Deck = db.Deck;

// Like or dislike a deck
const rateDeck = async (req, res) => {
  try {
    const { deckId } = req.params;
    const { isLike } = req.body;
    const userId = req.user.id;

    if (typeof isLike !== 'boolean') {
      return res.status(400).json({
        status: "error",
        message: "isLike must be a boolean value",
      });
    }

    // Verify that the deck exists
    const deck = await Deck.findOne({
      where: { id: deckId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    // Create or update the rating
    const [deckRating, created] = await DeckRating.findOrCreate({
      where: { deckId, userId },
      defaults: { isLike },
    });

    if (!created) {
      await deckRating.update({ isLike });
    }

    return res.status(200).json({
      status: "success",
      data: deckRating,
    });
  } catch (error) {
    console.error("Failed to rate deck:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to rate deck",
      error: error.message,
    });
  }
};

// Get deck ratings
const getDeckRatings = async (req, res) => {
  try {
    const { deckId } = req.params;

    // Verify that the deck exists
    const deck = await Deck.findOne({
      where: { id: deckId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    const ratings = await DeckRating.findAll({
      where: { deckId },
      include: [
        {
          model: db.User,
          attributes: ["id", "userName"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    // Calculate likes and dislikes
    const likes = ratings.filter(rating => rating.isLike).length;
    const dislikes = ratings.filter(rating => !rating.isLike).length;

    return res.status(200).json({
      status: "success",
      data: {
        ratings,
        likes,
        dislikes,
        totalRatings: ratings.length,
      },
    });
  } catch (error) {
    console.error("Failed to get deck ratings:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get deck ratings",
      error: error.message,
    });
  }
};

// Get user's rating for a deck
const getUserRating = async (req, res) => {
  try {
    const { deckId } = req.params;
    const userId = req.user.id;

    // Verify that the deck exists
    const deck = await Deck.findOne({
      where: { id: deckId },
    });

    if (!deck) {
      return res.status(404).json({
        status: "error",
        message: "Deck not found",
      });
    }

    const rating = await DeckRating.findOne({
      where: { deckId, userId },
    });

    return res.status(200).json({
      status: "success",
      data: rating || null,
    });
  } catch (error) {
    console.error("Failed to get user rating:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get user rating",
      error: error.message,
    });
  }
};

// Delete a deck rating
const deleteDeckRating = async (req, res) => {
  try {
    const { deckId } = req.params;
    const userId = req.user.id;

    const rating = await DeckRating.findOne({
      where: { deckId, userId },
    });

    if (!rating) {
      return res.status(404).json({
        status: "error",
        message: "Rating not found",
      });
    }

    await rating.destroy();

    return res.status(200).json({
      status: "success",
      message: "Rating deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete deck rating:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to delete deck rating",
      error: error.message,
    });
  }
};

module.exports = {
  rateDeck,
  getDeckRatings,
  getUserRating,
  deleteDeckRating,
}; 