// src/services/analyticsService.js

import CV from '../models/cv.js'; // Ensure .js extension
import mongoose from 'mongoose';

class AnalyticsService {

  // Get and calculate all analytics for a user in one database call
  async getAnalytics(userId) {
    try {
      const result = await CV.aggregate([
        // Stage 1: Filter documents by the current user
        {
          $match: { uploadedBy: new mongoose.Types.ObjectId(userId) } // Correct usage for ObjectId
        },
        // Stage 2: Group the documents and count them by status
        {
          $group: {
            _id: '$status', // Group by the status field
            count: { $sum: 1 } // Count the documents in each group
          }
        }
      ]);

      // Process the result to get all counts
      let analytics = {
        totalCVs: 0,
        pendingCVs: 0,
        reviewedCVs: 0,
        shortlistedCVs: 0,
        rejectedCVs: 0
      };

      result.forEach(item => {
        analytics.totalCVs += item.count;
        if (item._id === 'pending') {
          analytics.pendingCVs = item.count;
        } else if (item._id === 'reviewed') {
          analytics.reviewedCVs = item.count;
        } else if (item._id === 'shortlisted') {
          analytics.shortlistedCVs = item.count;
        } else if (item._id === 'rejected') {
          analytics.rejectedCVs = item.count;
        }
      });

      return analytics;

    } catch (error) {
      console.error('Calculate analytics error:', error);
      // It's good practice to re-throw or return a specific error for the caller to handle
      throw new Error('Failed to retrieve analytics data.'); // Throwing a new Error with a user-friendly message
    }
  }

  // As discussed, if cvController.js calls analyticsService.updateAnalytics(userId),
  // you might need to implement logic here, or if getAnalytics is always sufficient,
  // this method could be a placeholder or simply removed if not used.
  async updateAnalytics(userId) {
    console.log(`Analytics update triggered for user: ${userId}. Recalculating latest state.`);
    // In many cases, just calling getAnalytics again is sufficient if analytics aren't persisted separately.
    // If you need to, e.g., push updates to a real-time frontend via websockets, you'd do it here.
  }
}

export default new AnalyticsService(); // Export an instance of the class