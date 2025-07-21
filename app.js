import 'dotenv/config';  
import cors from 'cors';
// server/routes/router.js
import router from './server/routes/router.js';

// Importing the database connection function
import connectDB from './server/config/db.js';

// Importing the express module
import express from 'express';
const app = express();

// routes
app.use('/api', router);

app.use(cors());

// port 
const PORT = process.env.PORT || 5000;
try{
    // Connecting to the database
    console.log('Connecting to the database...');
    await connectDB();

    // listening to the server
    console.log('server started......')
    app.listen(PORT, () => {
        console.log(`Server is running on port http://localhost:${PORT}`);
    });
}catch(error){
    console.error(`Error: ${error.message}`);
    process.exit(1);
}