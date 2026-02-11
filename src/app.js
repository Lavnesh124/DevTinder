const express=require('express');
const connectDB=require('./config/database'); // Connect to the database
const User=require('./models/user'); // Import the User model
const { validateSignupData } = require('./utils/validation'); // Import the validation function
const bcrypt=require('bcrypt'); // Import bcrypt for password hashing
const cookieParser=require('cookie-parser'); // Import cookie-parser for handling cookies
const jwt=require('jsonwebtoken'); // Import jsonwebtoken for token handling
const { UserAuth }=require('./middlewares/auth'); // Import the authentication middleware
const authRouter=require('./routes/auth'); // Import the authentication routes
const profileRouter=require('./routes/profile'); // Import the profile routes
const requestRouter=require('./routes/request'); // Import the request routes
const userRouter=require('./routes/user'); // Import the user routes

const app=express();


app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies


app.use('/auth',authRouter);
app.use('/profile',profileRouter);
app.use('/request',requestRouter);  
app.use('/user',userRouter);  



connectDB().then(()=>{
    console.log('Database connected successfully');
    app.listen(7777,()=>{
        console.log('Server is running on port 7777');
    });
}).catch((err)=>{
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the application if the database connection fails
});



