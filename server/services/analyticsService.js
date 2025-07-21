const CV = require('../models/cv');
const mongoose = require('mongoose');

class AnalyticsService {

  // Get and calculate all analytics for a user in one database call
  async getAnalytics(userId) {
    try {
      const result = await CV.aggregate([
        // Stage 1: Filter documents by the current user
        {
          $match: { uploadedBy: mongoose.Types.ObjectId(userId) }
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
      throw error;
    }
  }
}

module.exports = new AnalyticsService();