// src/controllers/cvController.js

import CV from '../models/cv.js';                          // Ensure .js extension
import cvAnalyzer from '../services/cvAnalyzer.js';      // Ensure .js extension
import analyticsService from '../services/analyticsService.js'; // Ensure .js extension
import FileProcessor from '../services/fileProcessor.js';  // Ensure .js extension and correct name (no typo!)
import fs from 'fs/promises';                            // Use 'fs/promises' for async file operations
import path from 'path';                                 // Import path module

// Get __dirname and __filename equivalent for ES Modules if needed for file paths
// import { fileURLToPath } from 'url';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);


class CVController {

  async uploadCV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { file } = req;
      const userId = req.user._id; // From auth middleware, use _id for Mongoose

      console.log(`Processing CV: ${file.originalname}`);

      // Step 1: Extract text from uploaded file using FileProcessor
      // Ensure file.path is correct for where Multer saves the file
      const extractedText = await FileProcessor.extractText(file.path, file.mimetype);

      // Step 2: Analyze CV using cvAnalyzer (which should use FileProcessor internally if needed)
      const analysisResult = await cvAnalyzer.analyzeCV(extractedText, file.originalname);

      // Step 3: Save CV to MongoDB
      const cvData = new CV({
        fileName: file.originalname,
        filePath: file.path, // Store the path where Multer saved it
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,

        // Analysis results from your logic
        candidateName: analysisResult.candidateName,
        position: analysisResult.position,
        experience: analysisResult.experience,
        skills: analysisResult.skills,
        education: analysisResult.education,
        location: analysisResult.location,
        score: analysisResult.score,
        status: analysisResult.status,
      });

      await cvData.save();

      // Update analytics after upload
      await analyticsService.updateAnalytics(userId); // This will re-calculate or trigger update

      res.status(201).json({
        message: 'CV uploaded and processed successfully!',
        cv: cvData,
        analysis: analysisResult
      });

    } catch (error) {
      console.error('Upload CV error:', error);
      // Clean up uploaded file if an error occurs during processing
      if (req.file && fs.existsSync(req.file.path)) {
        await fs.unlink(req.file.path).catch(err => console.error('Error deleting failed upload:', err));
      }
      res.status(500).json({ message: 'Failed to upload and process CV', error: error.message });
    }
  }

  async getCVs(req, res) {
    console.log('[getCVs] Route handler entered.'); // ADD THIS LINE
    try {
      // Assuming req.user is set by authentication middleware
      const userId = req.user._id;
      console.log(`[getCVs] Fetching CVs for user ID: ${userId}`); // ADD THIS LINE

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

      if (!['pending', 'reviewed', 'shortlisted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided.' });
      }

      const cv = await CV.findOneAndUpdate(
        { _id: id, uploadedBy: userId },
        { status },
        { new: true } // Return the updated document
      );

      if (!cv) {
        return res.status(404).json({ message: 'CV not found or not authorized.' });
      }

      // Update analytics after status change
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

      // Delete physical file (using fs.promises for async unlink)
      if (cv.filePath) { // Only try to delete if path exists
        try {
          await fs.unlink(cv.filePath);
          console.log(`Deleted physical file: ${cv.filePath}`);
        } catch (fileError) {
          console.warn(`Could not delete physical file ${cv.filePath}:`, fileError.message);
          // Don't block response if file delete fails but DB record is gone
        }
      }

      // Update analytics after deletion
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

      // Check if file exists before attempting to send
      if (!fs.existsSync(cv.filePath)) {
        return res.status(404).json({ message: 'CV file not found on server.' });
      }

      res.download(cv.filePath, cv.fileName, (err) => {
        if (err) {
          console.error('Error downloading file:', err);
          res.status(500).json({ message: 'Error downloading file', error: err.message });
        }
      });
    } catch (error) {
      console.error('Download CV error:', error);
      res.status(500).json({ message: 'Failed to download CV', error: error.message });
    }
  }
}

export default new CVController();