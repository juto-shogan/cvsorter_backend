// src/routes/cvs.js (or wherever your cvs.js is located, ensure path in app.js is correct)

import express from 'express';
import cvController from '../controllers/cvController.js'; // Ensure .js extension
import {upload} from '../middleware/upload.js'; // This will now work
import {authenticateUser} from '../middleware/auth.js';     // Use authenticateUser for clarity and consistency

const router = express.Router();

// All routes require authentication for HR users
router.use(authenticateUser); // Using the explicit authenticateUser middleware

// 🔥 MAIN UPLOAD ROUTE - Frontend sends files here
router.post('/upload', upload.single('cv'), cvController.uploadCV);

// Get all CVs
router.get('/', cvController.getCVs);

// Update CV status
router.patch('/:id', cvController.updateCVStatus);

// Delete CV
router.delete('/:id', cvController.deleteCV);

// Download CV file
router.get('/:id/download', cvController.downloadCV);

export default router; // Export the router using ES Module syntax