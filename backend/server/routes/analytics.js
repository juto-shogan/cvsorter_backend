import express from 'express';
import analyticsService from '../services/analyticsService.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    const analytics = await analyticsService.getAnalytics(req.user._id);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

export default router;
