import UserModel from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../config/generateToken.js";

export const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (company_id || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Bad request: Missing required fields",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Bad request: Password too short. Must be at least 6 characters",
      });
    }
    const user = await UserModel.create({
      company_id,
      username,
      email,
      password,
    });
    const token = generateToken({ userId: user._id });
    res.status(201).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Not found: User does not exist",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({ userId: user._id });
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};