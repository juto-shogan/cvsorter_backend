// src/models/CV.js

import mongoose from 'mongoose';

// Define the schema for the CV model
const CVSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true,
    trim: true, // Removes whitespace from both ends of a string
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0, // Experience cannot be negative
  },
  skills: {
    type: [String], // Array of strings
    default: [],    // Default to an empty array
  },
  education: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  location: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true, // Stores emails in lowercase
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'], // Basic email validation
  },
  phone: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now, // Sets the default upload date to the current timestamp
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'], // Restrict status to these values
    default: 'pending', // Default status for new CVs
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt timestamps automatically
});

// Check if the model already exists before compiling it to prevent OverwriteModelError
// This is crucial for environments where models might be re-imported (e.g., hot-reloading)
const CV = mongoose.models.CV || mongoose.model('CV', CVSchema);

export default CV; // Export the CV model