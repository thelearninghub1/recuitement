const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

// Import routes
const userRoutes = require('./routers/userRouters/userRouters');
const jobsRoutes = require('./routers/jobsposting/jobRoutes');
const contactRoutes = require('./routers/contactRouter'); // 
const planRoutes = require('./routers/planRoutes');
const paymentRoutes = require('./routers/paymentRoutes');
const subscriptionRoutes = require('./routers/subscriptionRoutes');

// Import middleware - FIXED PATH
const errorHandler = require('./middlewares/asyncHandler');

const app = express();

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Required for React/Vite dev but also for build if inline scripts exist
        styleSrc: ["'self'", "'unsafe-inline'",           "https://fonts.googleapis.com"  // ← Added
],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com"     // ← Added
        ],

      //  connectSrc: ["'self'", "http://localhost:5000"], // If you have API calls
        connectSrc: ["'self'", "https://theteachingpath.com"], // If you have API calls
      },
    },
  })
);
app.use(cookieParser());

// CORS middleware
app.use(cors({
  origin:'http://localhost:5173',
  //origin:'*',
  credentials: true
}));



// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(hpp());


// Static files with CORS headers

const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));


// Routes
app.use('/api', userRoutes);
app.use('/api', jobsRoutes);
app.use('/api', contactRoutes);
app.use('/api', planRoutes);
app.use('/api', paymentRoutes);
app.use('/api', subscriptionRoutes);

 
   

       // Frontend Connect to Backend

 
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname, "../frontend/dist/index.html"));
})
  
   





// Error handling middleware (should be last)
app.use(errorHandler);




module.exports = app;