import CV from '../models/cv.js';
import mongoose from 'mongoose';

class AnalyticsService {
  async getAnalytics(userId) {
    try {
      const objectId = new mongoose.Types.ObjectId(userId);
      const result = await CV.aggregate([
        { $match: { uploadedBy: objectId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]);

      const analytics = {
        total: 0,
        approved: 0,
        reviewed: 0,
        rejected: 0,
      };

      result.forEach(({ _id, count }) => {
        analytics.total += count;
        if (_id === 'approved') analytics.approved = count;
        if (_id === 'reviewed') analytics.reviewed = count;
        if (_id === 'rejected') analytics.rejected = count;
      });

      return analytics;
    } catch (error) {
      console.error('Calculate analytics error:', error);
      throw new Error('Failed to retrieve analytics data.');
    }
  }

  async updateAnalytics() {
    // no-op for now: analytics are computed on demand via aggregation
  }
}

export default new AnalyticsService();
