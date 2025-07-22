import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/generateToken.js";

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
export const createUser = async (req, res) => {
  const { username, email, password } = req.body; // company_id removed per your request
  try {
    // Basic validation check
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Missing required fields (username, email, or password)",
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
        message: "Bad request: Password too short. Must be at least 6 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      // role will default to 'hr' as per your User model setup
    });

    const token = generateToken({ userId: user._id });
    res.status(201).json({
      success: true,
      user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role // Assuming your User model has a default role 'hr'
      },
      token,
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error during user registration.",
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
    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Not found: User does not exist",
      });
    }

    // Compare provided password with hashed password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password", // Use a generic message for security
      });
    }

    // Generate JWT token
    const token = generateToken({ userId: user._id });

    // Send success response with user data and token
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
    console.error("Error in loginUser:", error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: "Internal server error during login.",
    });
  }
};