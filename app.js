require('dotenv').config();

// Importing the express module
const express = require('express');
const app = express();

// Importing the database connection function
const connectDB = require('./server/config/db');

// port 
const PORT = process.env.PORT || 5000;

// Connecting to the database
connectDB();


// routes
app.use('/', require('./server/routes/main'));

// listening to the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 