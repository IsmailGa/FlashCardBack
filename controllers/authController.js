require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, UserSession } = require("../models");
const { Op } = require("sequelize");

// Register a new user
const register = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { userName }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User with this email or username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      userName,
      email,
      hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Error registering user" });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate access token
    const accessToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Generate refresh token
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Create session with refresh token
    await UserSession.create({
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    // Set refresh token in HTTP-only cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Login successful",
      accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
};

// Logout user
const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "No refresh token found" });
    }

    // Deactivate session
    await UserSession.update(
      { isActive: false },
      {
        where: {
          token: refreshToken,
          userId: req.user.id,
        },
      }
    );

    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Error logging out" });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["hashedPassword"] },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({ message: "Error getting user" });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const { fullName, userName, email, avatarUrl } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if username or email is already taken
    if (userName || email) {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [
            { userName: userName || user.userName },
            { email: email || user.email },
          ],
          id: { [Op.ne]: user.id },
        },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Username or email already taken",
        });
      }
    }

    // Update user
    await user.update({
      fullName: fullName || user.fullName,
      userName: userName || user.userName,
      email: email || user.email,
      avatarUrl: avatarUrl || user.avatarUrl,
    });

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user.id,
        fullName: user.fullName,
        userName: user.userName,
        email: user.email,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.hashedPassword
    );
    if (!isValidPassword) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await user.update({ hashedPassword });

    // Deactivate all sessions
    await UserSession.update(
      { isActive: false },
      {
        where: {
          userId: user.id,
        },
      }
    );

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};

// Refresh access token
const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    // Check if session exists and is active
    const session = await UserSession.findOne({
      where: {
        token: refreshToken,
        userId: req.user.id,
        isActive: true,
        expiresAt: { [Op.gt]: new Date() }
      }
    });

    if (!session) {
      // Clear the invalid refresh token cookie
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: "Invalid or expired refresh token" });
    }

    // Generate new access token
    const newAccessToken = jwt.sign(
      { id: req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    res.json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      user: {
        id: req.user.id,
        fullName: req.user.fullName,
        userName: req.user.userName,
        email: req.user.email,
        avatarUrl: req.user.avatarUrl,
      },
    });
  } catch (error) {
    console.error("Token refresh error:", error);
    if (error.name === 'TokenExpiredError') {
      // Clear the expired refresh token cookie
      res.clearCookie('refreshToken');
      return res.status(401).json({ message: "Refresh token has expired" });
    }
    res.status(500).json({ message: "Error refreshing token" });
  }
};

// Get another user's profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'userName', 'fullName', 'avatarUrl', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    console.error("Failed to get user profile:", error);
    return res.status(500).json({
      status: "error",
      message: "Failed to get user profile",
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  refreshToken,
  getUserProfile,
};
