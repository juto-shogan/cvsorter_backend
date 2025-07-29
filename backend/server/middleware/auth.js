// src/middleware/auth.js (partial code)

import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
  console.log('[authenticateUser] Middleware entered.'); // ADD THIS LINE
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(`[authenticateUser] Token received (first 10 chars): ${token ? token.substring(0,10) + '...' : 'None'}`); // ADD THIS LINE

    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`[authenticateUser] Token decoded for userId: ${decodedToken.userId}`); // ADD THIS LINE
      const user = await UserModel.findById(decodedToken.userId);

      if (!user) {
        console.warn('[authenticateUser] User not found for decoded token.'); // ADD THIS LINE
        return res.status(401).json({
          success: false,
          error: "User not found (token valid, but user ID missing or invalid)",
        });
      }

      req.user = user;
      console.log(`[authenticateUser] User authenticated: ${user.email}`); // ADD THIS LINE
      next();
    } catch (error) {
      console.error("Authentication error:", error.message);
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token",
      });
    }
  } else {
    console.warn('[authenticateUser] No Authorization header received.'); // ADD THIS LINE
    return res.status(401).json({
      success: false,
      error: "Authorization header is required",
    });
  }
};