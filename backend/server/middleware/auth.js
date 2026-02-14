import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';

const isDebug = process.env.NODE_ENV !== 'production';

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authorization header is required',
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Bearer token is required',
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decodedToken.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found (token valid, but user ID missing or invalid)',
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (isDebug) {
      console.error('Authentication error:', error.message);
    }
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token',
    });
  }
};
