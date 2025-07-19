const mongoose = require('mongoose');

// Define the schema for the CVs collection
const cvSchema = new mongoose.Schema({
    // Link the CV to the user who uploaded it
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // This references a separate 'User' model
        required: true
    },
    
    // Store metadata about the file
    filename: {
        type: String,
        required: true
    },
    file_url: {
        type: String, // The URL where the actual file is stored
        required: true
    },
    
    // Store the raw text for search, filtering, and sorting
    extracted_text: {
        type: String,
        required: true
    },
    
    // Store the results from your Python logic
    best_role: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    grade: {
        type: String,
        enum: ['Passed', 'Under consideration', 'Failed'],
        default: 'Under consideration'
    },
    matched_keywords: {
        type: [String], // An array of strings for all matched keywords
        default: []
    },
    
    // Timestamps for tracking
    uploaded_at: {
        type: Date,
        default: Date.now
    }
});

// Export the model for use in other files
module.exports = mongoose.model('CV', cvSchema);