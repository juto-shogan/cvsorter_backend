import UserModel from "../models/user.js";
import { generateToken } from "../config/generateToken.js";

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
export const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: username, email, or password",
      });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const user = await UserModel.create({ username, email, password });

    const token = generateToken({ userId: user._id });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error in createUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during user registration.",
      error: error.message,
    });
  }
};

/**
 * @route POST /api/auth/login
 * @description Authenticate and log in a user
 * @access Public
 */
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Missing email or password.",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const token = generateToken({ userId: user._id });

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("❌ Error in loginUser:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during login.",
      error: error.message,
    });
  }
};
