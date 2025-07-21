import mongoose from 'mongoose';

// server/config/db.js
const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(
      process.env.MONGODB_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    console.log(`MongoDB connected successfully: ${conn.connection.host}`);
  } catch (error) {
    
  // Handle connection errors
    console.error('MongoDB connection error:', error);
  }
}

export default connectDB;