// server/routes/main.js
// importing necessary modules
const express = require('express');
const router = express.Router();

// starter routes
router.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

router.get('/dashboard', (req, res) => {
    res.send('This is the about page.');
});

router.get('/contact', (req, res) => {
    res.send('This is the contact page.');
});

router.post('/upload-cv', (req, res) => {
    // Handle file upload logic here
    res.send('CV uploaded successfully!');
});


// Exporting the router
module.exports = router;