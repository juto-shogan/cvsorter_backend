
import express from 'express'
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import 'dotenv/config'

// Import routes
import auth from './routes/auth';
import cvs from'./routes/cvs';
// the following was commented cause i havent made the router yet

// import analyticsRoutes from './routes/analytics';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', auth);
app.use('/api/cvs', cvs);        // 🔥 CV upload routes
// app.use('/api/analytics', analyticsRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

export default app;