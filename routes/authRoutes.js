const express = require("express");
const router = express.Router();
const { verifyToken, verifyRefreshToken, validateToken } = require("../middleware/authMiddleware");
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshToken,
  getUserProfile
} = require("../controllers/authController");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", verifyRefreshToken, refreshToken);
router.post("/validate-token", validateToken);

// Protected routes
router.post("/logout", verifyToken, logout);
router.get("/me", verifyToken, getCurrentUser);
router.put("/profile", verifyToken, updateProfile);
router.put("/change-password", verifyToken, changePassword);
router.get("/:userId", verifyToken, getUserProfile);

module.exports = router;
