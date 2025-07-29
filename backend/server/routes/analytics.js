// src/routes/analytics.js
import express from 'express';
import AnalyticsService from '../services/analyticsService.js'; // Ensure .js extension and correct path
import { authenticateUser } from '../middleware/auth.js';      // <--- CHANGE THIS LINE

const router = express.Router();

/**
 * @route GET /api/analytics/dashboard
 * @description Get dashboard analytics for the authenticated user
 * @access Private
 */
router.get('/dashboard', authenticateUser, async (req, res) => {
  try {
    // Assuming req.user.id is set by your authentication middleware
    const userId = req.user.id;
    const analytics = await AnalyticsService.getAnalytics(userId);
    res.json(analytics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
});

export default router;