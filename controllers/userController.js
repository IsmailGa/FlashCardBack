const { User } = require("../models");
const { Op } = require("sequelize");
const { isUUID } = require("validator");

const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate UUID format before making database query
    if (!isUUID(userId, 4)) {
      return res.status(400).json({
        status: "error",
        message: "Invalid user ID format",
        details: {
          received: userId,
          expectedFormat: "UUID v4",
          example: "123e4567-e89b-12d3-a456-426614174000"
        }
      });
    }

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'userName', 'fullName', 'avatarUrl', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
        details: {
          userId: userId
        }
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    // This catch block should only handle unexpected errors
    console.error("Unexpected error in getUserProfile:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: "An unexpected error occurred"
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = search ? {
      [Op.or]: [
        { userName: { [Op.iLike]: `%${search}%` } },
        { fullName: { [Op.iLike]: `%${search}%` } }
      ]
    } : {};

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'userName', 'fullName', 'avatarUrl', 'createdAt'],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']]
    });

    return res.status(200).json({
      status: "success",
      data: {
        users,
        pagination: {
          total: count,
          page: parseInt(page),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error("Failed to get users:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get users",
      error: error.message,
    });
  }
};

module.exports = {
  getUserProfile,
  getAllUsers
}; 