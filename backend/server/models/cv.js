import mongoose from 'mongoose';

const CVSchema = new mongoose.Schema({
  candidateName: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  experience: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  skills: {
    type: [String],
    default: [],
  },
  education: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  location: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: 'n/a@example.com',
  },
  phone: {
    type: String,
    trim: true,
    default: 'N/A',
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewed', 'approved', 'rejected'],
    default: 'pending',
  },
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
});

const CV = mongoose.models.CV || mongoose.model('CV', CVSchema);

export default CV;
