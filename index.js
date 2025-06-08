require("dotenv").config();
const express = require("express");
const sequelize = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const deckRoutes = require("./routes/deckRoutes");
const cardRoutes = require("./routes/cardRoutes");
const deckRatingRoutes = require("./routes/deckRatingRoutes");
const userCardAnswerRoutes = require("./routes/userCardAnswerRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000', // Replace with your frontend URL
  credentials: true // This is important for cookies
}));

app.get("/", (req, res) => {
  res.send("Welcome to the API!");
});

// Auth routes
app.use("/api/v1/auth", authRoutes);

// Deck routes
app.use("/api/v1/decks", deckRoutes);

// Card routes (nested under decks)
app.use("/api/v1/decks/:deckId/cards", cardRoutes);

// Deck rating routes (nested under decks)
app.use("/api/v1/decks/:deckId/ratings", deckRatingRoutes);

// User card answer routes (nested under decks)
app.use("/api/v1/decks/:deckId/answers", userCardAnswerRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

startServer();
