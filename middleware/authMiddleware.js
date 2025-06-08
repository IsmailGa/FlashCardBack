require("dotenv").config();
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.User;

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(401).json({ message: "Authentication error", error: error.message });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = user;
    req.refreshToken = refreshToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token", error: error.message });
  }
};

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    res.status(200).json({ valid: true, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

module.exports = { verifyToken, verifyRefreshToken, validateToken };
