import CV from '../models/cv.js';
import cvAnalyzer from '../services/cvAnalyzer.js';
import analyticsService from '../services/analyticsService.js';
import FileProcessor from '../services/fileProcessor.js';
import { access, unlink } from 'fs/promises';
import { constants as fsConstants } from 'fs';

const fileExists = async (path) => {
  try {
    await access(path, fsConstants.F_OK);
    return true;
  } catch {
    return false;
  }
};

class CVController {
  async uploadCV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { file } = req;
      const userId = req.user._id;

      const extractedText = await FileProcessor.extractText(file.path, file.mimetype);
      const analysisResult = await cvAnalyzer.analyzeCV(extractedText, file.originalname);

      const cvData = new CV({
        fileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
        candidateName: analysisResult.candidateName,
        position: analysisResult.position,
        experience: Number(analysisResult.experience) || 0,
        skills: analysisResult.skills || [],
        education: analysisResult.education,
        location: analysisResult.location,
        email: analysisResult.email,
        phone: analysisResult.phone,
        score: analysisResult.totalScore,
        status: analysisResult.status,
      });

      await cvData.save();
      await analyticsService.updateAnalytics(userId);

      res.status(201).json({
        message: 'CV uploaded and processed successfully!',
        cv: cvData,
        analysis: analysisResult,
      });
    } catch (error) {
      console.error('Upload CV error:', error);
      if (req.file && await fileExists(req.file.path)) {
        await unlink(req.file.path).catch((err) => console.error('Error deleting failed upload:', err));
      }
      res.status(500).json({ message: 'Failed to upload and process CV', error: error.message });
    }
  }

  async getCVs(req, res) {
    try {
      const userId = req.user._id;
      const cvs = await CV.find({ uploadedBy: userId }).sort({ uploadDate: -1 });
      res.json(cvs);
    } catch (error) {
      console.error('Get CVs error:', error);
      res.status(500).json({ message: 'Failed to fetch CVs', error: error.message });
    }
  }

  async updateCVStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user._id;

      if (!['pending', 'reviewed', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
      }

      const cv = await CV.findOneAndUpdate(
        { _id: id, uploadedBy: userId },
        { status },
        { new: true }
      );

      if (!cv) {
        return res.status(404).json({ message: 'CV not found or not authorized.' });
      }

      await analyticsService.updateAnalytics(userId);

      res.json({ message: 'CV status updated successfully', cv });
    } catch (error) {
      console.error('Update CV status error:', error);
      res.status(500).json({ message: 'Failed to update CV status', error: error.message });
    }
  }

  async deleteCV(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const cv = await CV.findOneAndDelete({ _id: id, uploadedBy: userId });

      if (!cv) {
        return res.status(404).json({ message: 'CV not found or not authorized.' });
      }

      if (cv.filePath) {
        try {
          await unlink(cv.filePath);
        } catch (fileError) {
          console.warn(`Could not delete physical file ${cv.filePath}:`, fileError.message);
        }
      }

      await analyticsService.updateAnalytics(userId);

      res.json({ message: 'CV deleted successfully' });
    } catch (error) {
      console.error('Delete CV error:', error);
      res.status(500).json({ message: 'Failed to delete CV', error: error.message });
    }
  }

  async downloadCV(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id;

      const cv = await CV.findOne({ _id: id, uploadedBy: userId });

      if (!cv) {
        return res.status(404).json({ message: 'CV not found or not authorized.' });
      }

      if (!await fileExists(cv.filePath)) {
        return res.status(404).json({ message: 'CV file not found on server.' });
      }

      res.download(cv.filePath, cv.fileName, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          if (!res.headersSent) {
            res.status(500).json({ message: 'Error downloading file', error: err.message });
          }
        }
      });
    } catch (error) {
      console.error('Download CV error:', error);
      res.status(500).json({ message: 'Failed to download CV', error: error.message });
    }
  }
}

export default new CVController();
