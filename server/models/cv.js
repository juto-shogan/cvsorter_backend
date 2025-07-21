const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
  // File Information
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  
  // Extracted CV Data (from your analysis logic)
  candidateName: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: Number, required: true },
  skills: [{ type: String }],
  education: { type: String, required: true },
  location: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  
  // Analysis Results (from your main.py logic)
  score: { type: Number, min: 0, max: 100 },
  analysisData: { type: mongoose.Schema.Types.Mixed }, // Raw analysis output
  matchingCriteria: {
    skillsMatch: { type: Number, default: 0 },
    experienceMatch: { type: Number, default: 0 },
    educationMatch: { type: Number, default: 0 }
  },
  
  // Status Management
  status: { 
    type: String, 
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
    default: 'pending'
  },
  
  // Metadata
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  uploadDate: { type: Date, default: Date.now },
  lastModified: { type: Date, default: Date.now }
}, { timestamps: true });

// Export the model for use in other files
module.exports = mongoose.model('CV', cvSchema);