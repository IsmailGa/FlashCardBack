const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getUserProfile, getAllUsers } = require('../controllers/userController');

// Get all users with pagination and search
router.get('/', verifyToken, getAllUsers);

// Get user profile
router.get('/:userId', verifyToken, getUserProfile);

module.exports = router; 