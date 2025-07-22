// src/controllers/authController.js (formerly userController.js)
import UserModel from "../models/user.js"; // Note: Capital 'U' for model
import bcrypt from "bcrypt";
import { generateToken } from "../config/generateToken.js"; // Assuming you have this util

export const createUser = async (req, res) => {
  const { company_id, username, email, password } = req.body; // Added company_id as per your schema
  try {
    // Check for missing fields
    if (!company_id || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Missing required fields",
      });
    }

    // Check password length
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Password too short. Must be at least 6 characters",
      });
    }

    // Check if user with email already exists (handled by schema pre-save hook, but good to have here too)
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ // 409 Conflict is more appropriate here
        success: false,
        message: "Email already in use",
      });
    }

    const user = await UserModel.create({
      company_id, // Make sure company_id is provided in the request body
      username,
      email,
      password, // Password will be hashed by the pre-save hook in your UserModel
    });

    const token = generateToken({ userId: user._id }); // Use user._id as per Mongoose

    res.status(201).json({
      success: true,
      user: {
        id: user._id, // Send back _id as id for frontend
        username: user.username,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
      },
      token,
    });
  } catch (error) {
    // Check if error is due to duplicate username (from unique constraint)
    if (error.code === 11000 && error.keyPattern && error.keyPattern.username) {
        return res.status(409).json({
            success: false,
            message: "Username already taken",
        });
    }
    console.error("Create user error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Missing email or password",
      });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Not found: Invalid email or password", // Generic message for security
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({ userId: user._id }); // Use user._id

    res.status(200).json({
      success: true,
      user: {
        id: user._id, // Send back _id as id for frontend
        username: user.username,
        email: user.email,
        role: user.role,
        company_id: user.company_id,
      },
      token,
    });
  } catch (error) {
    console.error("Login user error:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};