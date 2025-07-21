const express = require('express');
const cvController = require('../controllers/cvController');
const upload = require('../middleware/upload');
const auth = require('../middleware/auth');

const router = express.Router();

// All routes require authentication
router.use(auth);

// 🔥 MAIN UPLOAD ROUTE - Frontend sends files here
router.post('/upload', upload.single('cv'), cvController.uploadCV);

// Get all CVs
router.get('/', cvController.getCVs);

// Update CV status
router.patch('/:id', cvController.updateCVStatus);

// Delete CV
router.delete('/:id', cvController.deleteCV);

// Download CV file
router.get('/:id/download', cvController.downloadCV);

const cvs = router;
export default cvs;