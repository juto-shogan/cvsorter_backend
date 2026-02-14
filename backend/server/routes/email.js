import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import CV from '../models/cv.js';

const router = express.Router();

router.post('/send-approved-cvs', authenticateUser, async (req, res) => {
  try {
    const { recipients, subject, message, includeAttachments, cvIds } = req.body;

    if (!Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({ message: 'At least one recipient is required.' });
    }

    if (!Array.isArray(cvIds) || cvIds.length === 0) {
      return res.status(400).json({ message: 'At least one CV ID is required.' });
    }

    const approvedCVs = await CV.find({
      _id: { $in: cvIds },
      uploadedBy: req.user._id,
      status: 'approved',
    }).select('fileName candidateName position');

    if (approvedCVs.length === 0) {
      return res.status(400).json({ message: 'No approved CVs found for provided IDs.' });
    }

    // Email provider integration can be added later.
    return res.status(200).json({
      message: 'Email request accepted.',
      queued: true,
      meta: {
        recipientsCount: recipients.length,
        includeAttachments: Boolean(includeAttachments),
        approvedCVCount: approvedCVs.length,
        subject: subject || 'Approved CV Candidates',
        preview: message || '',
      },
    });
  } catch (error) {
    console.error('send-approved-cvs error:', error);
    return res.status(500).json({ message: 'Failed to process email request.' });
  }
});

export default router;
