// src/middleware/auth.js
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => { // This is the named export
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const user = await UserModel.findById(decodedToken.userId);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "User not found (token valid, but user ID missing or invalid)",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Authentication error:", error.message);
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      error: "Authorization header is required",
    });
  }
};