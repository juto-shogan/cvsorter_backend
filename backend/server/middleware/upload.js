import multer from 'multer';
import path from 'path';
import fs from 'fs';

const isDebug = process.env.NODE_ENV !== 'production';

const uploadsDir = 'uploads';
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  if (isDebug) console.log(`[Multer Setup] Created uploads directory: ${uploadsDir}`);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.access(uploadsDir, fs.constants.W_OK, (err) => {
      if (err) {
        return cb(new Error(`Upload directory not writable: ${err.message}`));
      }
      return cb(null, uploadsDir);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    return cb(null, true);
  }

  return cb(new Error('Invalid file type. Only PDF, DOC, and DOCX files are allowed.'), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export { upload };
