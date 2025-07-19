const mongoose = require('mongoose');
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add auto-incrementing id field
userSchema.plugin(AutoIncrement, { inc_field: 'id' });

module.exports = mongoose.model('User', userSchema);