const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error; // Let the caller handle the error
  }
};

module.exports = { hashPassword };