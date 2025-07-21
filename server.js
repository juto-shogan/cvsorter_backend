import app from './server/app.js'
// Importing the database connection function
import connectDB from './server/config/db.js';


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