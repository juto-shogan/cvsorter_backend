// src/app.js

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config'; 
// Assuming your database connection function is handled elsewhere or not explicitly shown here,
// but ensure it's called somewhere, e.g., in a separate config file or directly at the top level.

// Import your route files using ES Module syntax
import authRoutes from './routes/auth.js';       // For HR user authentication (register, login, profile)
import cvsRoutes from './routes/cvs.js';          // For CV management (get all, download, etc.)
// NEW: Import the new miscellaneous routes for dashboard stats and upload
import miscRoutes from './routes/miscRoutes.js';
import emailRoutes from './routes/email.js';
// NOTE: We will handle dashboard stats via miscRoutes.js now, 
// so analyticsRoutes might become redundant for frontend dashboard calls.
// If analyticsRoutes contains other non-dashboard analytics, keep it.
// For now, let's assume dashboard stats are moved to miscRoutes.js.
// import analyticsRoutes from './routes/analytics.js'; 

const app = express();
const port = process.env.PORT || 5000; // Use process.env.PORT first, default to 5000

// --- Middleware Setup ---
app.use(helmet()); // Secure your app by setting various HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true // Allow cookies and authorization headers
}));
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded requests
//////////////////////////////////////////////////////////////////////////////////////

// Basic route for health check or root (optional, good for testing deployment)
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'CVSorter Backend API is running!' });
});


// --- API Route Mounting ---
// Use a consistent API prefix, e.g., '/api'
app.use('/api/auth', authRoutes); // Mount authentication routes
app.use('/api/cvs', cvsRoutes);   // Mount CV-specific routes (e.g., /api/cvs, /api/cvs/:id/download)

// Mount additional API routes
// - GET /api/dashboard-stats -> miscRoutes
// - POST /api/email/send-approved-cvs -> emailRoutes
app.use('/api', miscRoutes);
app.use('/api/email', emailRoutes);

// If analyticsRoutes still serves other purposes not covered by miscRoutes, keep it here.
// If it was only for dashboard stats, you might remove it or re-evaluate its purpose.
// app.use('/api/analytics', analyticsRoutes); 
//////////////////////////////////////////////////////////////////////////////////////

// Error handling middleware (keep this at the end of your middleware stack)
app.use((error, req, res, next) => {
  console.error('API Error:', error); // Log the error for debugging
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error',
    // In development, you might send the error details, but not in production
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

// Export the app for use in a separate server bootstrap file (e.g., www.js) 
// or directly start listening here if this is your main entry point.
// If you have a separate `bin/www` file, this export is standard.
export default app;

// If you want to start the server directly from app.js, uncomment the following:
/*
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
*/