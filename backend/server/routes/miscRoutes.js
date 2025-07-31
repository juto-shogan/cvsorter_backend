// src/routes/miscRoutes.js

import express from 'express';
import multer from 'multer'; // Import multer for handling file uploads
import path from 'path';     // Import path to work with file paths
// Assuming you have an authentication middleware to protect routes
import { authenticateUser } from '../middleware/auth.js'; 
// Assuming your Mongoose model for CV
import CV from '../models/CV.js'; // Adjust path if your CV model is elsewhere

const router = express.Router();

// --- Multer Configuration for File Uploads ---
// Configures disk storage for uploaded files
const storage = multer.diskStorage({
  // Defines the destination directory for uploaded CVs
  destination: (req, file, cb) => {
    // IMPORTANT: This directory must exist in your backend project.
    // Ensure 'uploads/cvs' exists relative to your project root or adjust the path.
    // Example: if this file is in 'src/routes', and 'uploads' is in the root,
    // then '../../uploads/cvs' correctly points to it.
    cb(null, path.join(__dirname, '../../uploads/cvs')); 
  },
  // Defines the filename for uploaded CVs
  filename: (req, file, cb) => {
    // Appends a timestamp to the original filename to prevent naming collisions
    // Example: '1678888888888-my_resume.pdf'
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initializes multer with the defined storage and file filter rules
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Allows only specific MIME types for CV files: PDF, DOC, DOCX
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true); // Accept the file if its type is allowed
    } else {
      // Reject the file with a custom error message if the type is not allowed
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX allowed.'), false);
    }
  },
  limits: { 
    fileSize: 10 * 1024 * 1024 // Sets a file size limit to 10MB (10 * 1024 * 1024 bytes)
  } 
});

// --- API Endpoints ---

// GET /api/dashboard-stats - Fetches statistics for the dashboard
// This route is protected by authenticateUser middleware, requiring a valid JWT.
router.get('/dashboard-stats', authenticateUser, async (req, res) => {
  try {
    // Count total, approved, reviewed, and rejected CVs from the database
    const total = await CV.countDocuments({});
    const approved = await CV.countDocuments({ status: 'approved' });
    const reviewed = await CV.countDocuments({ status: 'reviewed' });
    const rejected = await CV.countDocuments({ status: 'rejected' });

    // Send the statistics as a JSON response
    res.json({ total, approved, reviewed, rejected });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error); // Log the error for debugging
    res.status(500).json({ message: 'Server error when fetching dashboard stats' }); // Send a 500 status with a generic message
  }
});

// POST /api/upload-cv - Handles uploading of new CV files
// This route is protected by authenticateUser middleware and uses multer for single file upload.
router.post('/upload-cv', authenticateUser, upload.single('cvFile'), async (req, res) => {
  try {
    // Check if a file was actually uploaded by multer
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // In a real application, you would parse the CV content (e.g., PDF/DOCX) here
    // and extract details like candidate name, skills, experience, etc. for your CV model.
    // For this example, we're using placeholder/derived data.
    
    // Create a new CV document based on the uploaded file and some dummy data
    const newCV = new CV({
      // Attempts to derive candidate name from the original filename, e.g., 'CV_1_John_Doe.pdf' -> 'John Doe'
      candidateName: req.file.originalname.replace(/\.(pdf|docx?)$/i, '').split('_').slice(1).join(' ') || 'Unknown Candidate',
      position: 'Software Engineer', // Placeholder position
      experience: Math.floor(Math.random() * 10) + 1, // Random placeholder experience (1-10 years)
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express'], // Placeholder skills
      education: 'B.Sc. Computer Science', // Placeholder education
      location: 'Remote', // Placeholder location
      email: 'candidate@example.com', // Placeholder email
      phone: '123-456-7890', // Placeholder phone
      score: Math.floor(Math.random() * 100), // Random placeholder AI score (0-99)
      fileName: req.file.originalname, // Store the original filename
      filePath: req.file.path, // Store the server path where the file is saved
      uploadDate: new Date(), // Set the upload date to current timestamp
      status: 'reviewed', // Default status for newly uploaded CVs
    });

    await newCV.save(); // Save the new CV record to the database

    // Respond with the newly created CV object and 201 Created status
    res.status(201).json(newCV); 
  } catch (error) {
    console.error('Error uploading CV:', error); // Log the specific error for debugging
    // Handle Multer-specific errors (e.g., file size limit, invalid file type)
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'File too large, max 10MB' });
      }
    }
    // Handle other server errors
    // Ensure the message sent to frontend is generic for security, but log details.
    res.status(500).json({ message: error.message || 'Failed to upload CV due to a server error.' });
  }
});

export default router; // Export the router to be used in your main server file