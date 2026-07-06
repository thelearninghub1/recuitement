const app = require('./app');
const dotenv = require('dotenv');
const connnectDatabase = require('./config/database');
const initFolders = require('./utils/initFolders'); 


// Uncaught Exception
process.on('uncaughtException', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Uncaught Exception');
    process.exit(1);
});

// Config
dotenv.config({ path: './backend/config/config.env' });


// Initialize Folders 
initFolders();

// Connecting to database
connnectDatabase();

// Create A Server 
const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});



// Unhandle Promise Rejection
process.on('unhandledRejection', err => {
    
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled Promise Rejection');
    server.close(() => {
        
        process.exit(1);
    });
});
