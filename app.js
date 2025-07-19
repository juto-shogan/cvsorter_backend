import 'dotenv/config';  

// importings
// server/routes/router.js
import router from './server/routes/router.js';

// Importing the database connection function
import connectDB from './server/config/db.js';

// Importing the express module
import express from 'express';
const app = express();

// routes
app.use('/api', router);


// port 
const PORT = process.env.PORT || 5000;
try{
    // Connecting to the database
    console.log('Connecting to the database...');
    await connectDB();

    // listening to the server
    console.log('server stared......')
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}catch(error){
    console.error(`Error: ${error.message}`);
    console.log(error);
    process.exit(1);
}