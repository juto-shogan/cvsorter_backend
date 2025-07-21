const CV = require('../models/cv');
const cvAnalyzer = require('../services/cvAnalyzer');
const analyticsService = require('../services/analyticsService');
const fs = require('fs');

class CVController { 
  
  async uploadCV(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { file } = req;
      const userId = req.user.id; // From auth middleware

      console.log(`Processing CV: ${file.originalname}`);

      // Step 1: Extract text from uploaded file
      const extractedText = await cvAnalyzer.extractText(file.path, file.mimetype);

      // Step 2: Analyze CV using your main.py logic (converted to JavaScript)
      const analysisResult = await cvAnalyzer.analyzeCV(extractedText, file.originalname);

      // Step 3: Save CV to MongoDB
      const cvData = new CV({
        fileName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
        
        // Analysis results from your main.py logic
        candidateName: analysisResult.candidateName,
        position: analysisResult.position,
        experience: analysisResult.experience,
        skills: analysisResult.skills,
        education: analysisResult.education,
        location: analysisResult.location,
        email: analysisResult.email,
        phone: analysisResult.phone,
        score: analysisResult.score,
        analysisData: analysisResult.analysisData,
        
        status: 'pending' // Default status
      });

      const savedCV = await cvData.save();

      // Step 4: Update analytics (dashboard counts)
      await analyticsService.updateAnalytics(userId);

      console.log(`CV processed successfully: ${savedCV.candidateName}`);

      // Step 5: Return processed CV to frontend
      res.status(201).json({
        message: 'CV uploaded and analyzed successfully',
        cv: {
          id: savedCV._id,
          fileName: savedCV.fileName,
          uploadDate: savedCV.uploadDate,
          fileSize: savedCV.fileSize,
          candidateName: savedCV.candidateName,
          position: savedCV.position,
          experience: savedCV.experience,
          skills: savedCV.skills,
          education: savedCV.education,
          location: savedCV.location,
          email: savedCV.email,
          phone: savedCV.phone,
          status: savedCV.status,
          score: savedCV.score
        }
      });

    } catch (error) {
      console.error('CV upload error:', error);
      
      // Clean up uploaded file if processing failed
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      
      res.status(500).json({ 
        message: 'CV processing failed', 
        error: error.message 
      });
    }
  }

  // Get all CVs for a user
  async getCVs(req, res) {
    try {
      const userId = req.user.id;
      const cvs = await CV.find({ uploadedBy: userId })
        .sort({ uploadDate: -1 })
        .select('-filePath'); // Don't send file path to frontend

      res.json({ cvs });
    } catch (error) {
      console.error('Get CVs error:', error);
      res.status(500).json({ message: 'Failed to fetch CVs' });
    }
  }

  // Update CV status
  async updateCVStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const userId = req.user.id;

      const cv = await CV.findOneAndUpdate(
        { _id: id, uploadedBy: userId },
        { status, lastModified: new Date() },
        { new: true }
      );

      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }

      // Update analytics after status change
      await analyticsService.updateAnalytics(userId);

      res.json({ cv });
    } catch (error) {
      console.error('Update CV status error:', error);
      res.status(500).json({ message: 'Failed to update CV status' });
    }
  }

  // Delete CV
  async deleteCV(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const cv = await CV.findOneAndDelete({ _id: id, uploadedBy: userId });

      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }

      // Delete physical file
      if (fs.existsSync(cv.filePath)) {
        fs.unlinkSync(cv.filePath);
      }

      // Update analytics after deletion
      await analyticsService.updateAnalytics(userId);

      res.json({ message: 'CV deleted successfully' });
    } catch (error) {
      console.error('Delete CV error:', error);
      res.status(500).json({ message: 'Failed to delete CV' });
    }
  }

  // Download CV file
  async downloadCV(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const cv = await CV.findOne({ _id: id, uploadedBy: userId });

      if (!cv) {
        return res.status(404).json({ message: 'CV not found' });
      }

      if (!fs.existsSync(cv.filePath)) {
        return res.status(404).json({ message: 'File not found' });
      }

      res.download(cv.filePath, cv.fileName);
    } catch (error) {
      console.error('Download CV error:', error);
      res.status(500).json({ message: 'Failed to download CV' });
    }
  }
}

module.exports = new CVController();