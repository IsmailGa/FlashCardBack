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

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Create session
    await UserSession.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
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

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Create session
    await UserSession.create({
      userId: user.id,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      userAgent: req.headers["user-agent"],
      ipAddress: req.ip,
    });

    res.json({
      message: "Login successful",
      token,
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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // Deactivate session
    await UserSession.update(
      { isActive: false },
      {
        where: {
          token,
          userId: req.user.id,
        },
      }
    );

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

module.exports = { register, login, logout, getCurrentUser, updateProfile, changePassword };
