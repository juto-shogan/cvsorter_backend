// src/middleware/upload.js

import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log(`[Multer Setup] Created uploads directory: ${uploadsDir}`);
} else {
  console.log(`[Multer Setup] Uploads directory already exists: ${uploadsDir}`);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(`[Multer Destination] Attempting to save file to: ${uploadsDir}`);
    // Check if the directory is actually writable (optional, but good for deeper debug)
    fs.access(uploadsDir, fs.constants.W_OK, (err) => {
      if (err) {
        console.error(`[Multer Destination Error] ${uploadsDir} is not writable:`, err);
        cb(new Error(`Upload directory not writable: ${err.message}`));
      } else {
        cb(null, uploadsDir);
      }
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileName = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    console.log(`[Multer Filename] Generated filename: ${fileName} for original: ${file.originalname}`);
    cb(null, fileName);
  }
});

// File filter for CV files only
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];

  console.log(`[Multer Filter] Checking file: ${file.originalname}, MIME type: ${file.mimetype}`);
  if (allowedTypes.includes(file.mimetype)) {
    console.log(`[Multer Filter] File type ALLOWED: ${file.mimetype}`);
    cb(null, true);
  } else {
    console.warn(`[Multer Filter] File type DENIED: ${file.mimetype}`);
    cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit (already in your frontend, good to have here too)
});

export { upload };