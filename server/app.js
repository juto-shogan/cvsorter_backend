// app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config'; 

// Import your route files using ES Module syntax
import authRoutes from './routes/auth.js';      // For HR user authentication (register, login, profile)
import cvsRoutes from './routes/cvs.js';         // For CV upload and management
import analyticsRoutes from './routes/analytics.js'; // For analytics (dashboard)

const app = express();
const port = process.env.PORT || 5000; // Use process.env.PORT first, default to 5000
//////////////////////////////////////////////////////////////////////////////////////

// Middleware setup
// Middleware
app.use(helmet()); // Secure your app by setting various HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true // Allow cookies and authorization headers
}));
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true }));
//////////////////////////////////////////////////////////////////////////////////////

// Basic route for health check or root (optional, good for testing deployment)
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'CVSorter Backend API is running!' });
});


// Routes
// Use a consistent API prefix, e.g., '/api'
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvsRoutes);
app.use('/api/analytics', analyticsRoutes);
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

export default app;