const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getCurrentUser);
router.put("/profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);

module.exports = router;
