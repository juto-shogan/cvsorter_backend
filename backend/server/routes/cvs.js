import express from 'express';
import cvController from '../controllers/cvController.js';
import { upload } from '../middleware/upload.js';
import { authenticateUser } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

router.use(authenticateUser);

router.get('/', cvController.getCVs);

router.post('/upload', (req, res, next) => {
  upload.single('cv')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: 'File too large. Maximum 10MB allowed.' });
      }
      return res.status(500).json({ message: `File upload error: ${err.message}` });
    }

    if (err) {
      if (err.message.includes('Invalid file type')) {
        return res.status(400).json({ message: err.message });
      }
      return res.status(500).json({ message: `An unexpected error occurred: ${err.message}` });
    }

    next();
  });
}, cvController.uploadCV);

router.put('/:id', cvController.updateCVStatus);
router.delete('/:id', cvController.deleteCV);
router.get('/:id/download', cvController.downloadCV);

export default router;
