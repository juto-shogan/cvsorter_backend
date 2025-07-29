// src/routes/cvs.js (partial code)

import express from 'express';
import cvController from '../controllers/cvController.js';
import {upload} from '../middleware/upload.js';
import {authenticateUser} from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// All routes require authentication for HR users
router.use(authenticateUser);

// ... (your /upload route) ...

console.log('[cvs.js] Registering GET / route for fetching CVs'); // ADD THIS LINE

// Get all CVs
router.get('/', cvController.getCVs); // This is the route for /api/cvs

// 🔥 MAIN UPLOAD ROUTE - Frontend sends files here
router.post('/upload', (req, res, next) => {
  upload.single('cv')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred when uploading.
      console.error('Multer Error:', err.message);
      // For MulterError like file size limit or file type, return a specific status
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File too large. Maximum 10MB allowed.' });
      }
      if (err.message.includes('Invalid file type')) { // Check for your custom error message
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: `File upload error: ${err.message}` });
    } else if (err) {
      // An unknown error occurred when uploading.
      console.error('Unknown upload error:', err.message);
      return res.status(500).json({ message: `An unexpected error occurred: ${err.message}` });
    }
    // Everything went fine so far, pass to the next middleware (cvController.uploadCV)
    next();
  });
}, cvController.uploadCV);

// ... (your other routes like getCVs, updateCVStatus, deleteCV, downloadCV) ...

export default router;