import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const AutoIncrement = require('mongoose-sequence')(mongoose);

// server/models/user.js
// users model schema
// This schema defines the structure of user documents in the MongoDB database
// It includes fields for company_id, username, email, password, and createdAt timestamp
const userSchema = new mongoose.Schema({
  company_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role:{
    type: String,
    default: 'hr',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add auto-incrementing id field
userSchema.plugin(AutoIncrement, { inc_field: 'id' });

// Hash passwords after saving
userSchema.pre('save', async function (next) {
  const email = this.email;
  const user = await UserModel.findOne({ email });
  try{
    if (user) {
      const emailExists = new Error("Email already in use");
      return next(emailExists);
    }
  }catch (error) {
    throw new Error(error);
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();

});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model('User', userSchema);
export default UserModel;