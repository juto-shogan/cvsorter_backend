// src/routes/auth.js
import express from 'express';
import { createUser, loginUser } from '../controllers/authController.js'; 
import { validateUserRegistration, validateUserLogin } from '../middleware/validation.js'; // <--- Import validation middleware
import { authenticateUser } from '../middleware/auth.js'; 

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
router.post('/register', validateUserRegistration, createUser); // <--- Use validation middleware

/**
 * @route POST /api/auth/login
 * @description Authenticate and log in a user
 * @access Public
 */
router.post('/login', validateUserLogin, loginUser); // <--- Use validation middleware

// ... (other routes like /profile)
router.get('/profile', authenticateUser, (req, res) => {
    res.json({ 
        success: true,
        message: 'Welcome to your profile!', 
        user: {
            id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            role: req.user.role,
            company_id: req.user.company_id,
        }
    });
});

export default router;