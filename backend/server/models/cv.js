// src/models/cv.js

import mongoose from 'mongoose'; // Use import for mongoose

const CVSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  candidateName: String,
  position: String,
  experience: String,
  skills: [String],
  education: String,
  location: String,
  phone: String,
  email: String,
  totalScore: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'shortlisted', 'rejected'],
    default: 'pending',
  },
});

// Export the Mongoose model using ES Module default export
export default mongoose.model('CV', CVSchema);