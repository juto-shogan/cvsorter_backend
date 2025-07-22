// app.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config'; // Correct way to load .env variables for ES Modules

// Import the database connection function (assuming it's connectDB.js in server/config)
import connectDB from './config/db.js'; // Ensure this path is correct

// Import your route files using ES Module syntax
import authRoutes from './routes/auth.js';      // For HR user authentication (register, login, profile)
import cvsRoutes from './routes/cvs.js';         // For CV upload and management
import analyticsRoutes from './routes/analytics.js'; // For analytics (dashboard)

const app = express();
const port = process.env.PORT || 5000; // Use process.env.PORT first, default to 5000

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Secure your app by setting various HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Adjust this to your frontend URL
  credentials: true // Allow cookies and authorization headers
}));
app.use(express.json()); // Body parser for JSON requests
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded requests

// --- Removed: express-ejs-layouts and EJS view engine setup ---
// Since this is an API backend for a React/Vite frontend (as per your README.md),
// you don't need server-side rendering setup (EJS, express-ejs-layouts, public static folder).
// If you do have static files for something, you can add `app.use(express.static('public'));`
// but it's usually handled by the frontend server.

// Routes
// Use a consistent API prefix, e.g., '/api'
app.use('/api/auth', authRoutes);
app.use('/api/cvs', cvsRoutes);
app.use('/api/analytics', analyticsRoutes);

// Basic route for health check or root (optional, good for testing deployment)
app.get('/api', (req, res) => {
  res.status(200).json({ message: 'CVSorter Backend API is running!' });
});

// Error handling middleware (keep this at the end of your middleware stack)
app.use((error, req, res, next) => {
  console.error('API Error:', error); // Log the error for debugging
  res.status(error.statusCode || 500).json({
    message: error.message || 'Internal Server Error',
    // In development, you might send the error details, but not in production
    error: process.env.NODE_ENV === 'development' ? error : {}
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  console.log(`Connected to MongoDB via ${process.env.MONGODB_URI ? 'environment variable' : 'default config'}`);
});

// For Vercel or other serverless deployments, you might export the app directly
export default app;