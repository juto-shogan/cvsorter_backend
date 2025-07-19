const mongoose = require('mongoose');

// server/config/db.js
const connectDB = async () => {
  try {
    
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected successfully: ${conn.connection.host}`);

  } catch (error) {
    console.error('MongoDB connection error:', error);
  }

}

module.exports = connectDB;

