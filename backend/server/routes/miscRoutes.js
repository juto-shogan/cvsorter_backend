import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import analyticsService from '../services/analyticsService.js';

const router = express.Router();

router.get('/dashboard-stats', authenticateUser, async (req, res) => {
  try {
    const stats = await analyticsService.getAnalytics(req.user._id);
    res.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error when fetching dashboard stats' });
  }
});

export default router;
