const express= require('express');
const { validateSignupData } = require('../utils/validation'); // Import the validation function
 const User=require('../models/user');
bcrypt=require('bcrypt'); // Import bcrypt for password hashing
      


const authRouter=express.Router();

authRouter.post('/signup', async (req,res)=>{
    //Validating the Data
    validationResult = validateSignupData(req);
    if (!validationResult.valid) {
        return res.status(400).json({ message: validationResult.message });
    }

    const { firstname,lastname,email,password } = req.body;

    // Encrpt the password using bcrypt
    const passwordHash=await bcrypt.hash(password,10);
    console.log(passwordHash);

        //creating a new instance of User model with the data from the request body
        const user= new User({firstname,lastname,email,password:passwordHash});
    try{
        await user.save();  
        res.status(201).json({ message: 'User created successfully' });
    }
    catch(err){
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Internal server error' });
    }

});

authRouter.post('/login',async (req,res)=>{
    const { email,password } = req.body;
    try{
        const user= await User.findOne({email:email});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid=await user.validatePassword(password);
        if(!isPasswordValid){
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Creating a JWT token 

        const token=await user.getJWT();
        res.cookie("token",token);
        res.json({ message: 'Login successful' });
    }
    catch(err){
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

authRouter.post('/logout', async (req,res)=>{
    res.cookie("token",null,{expires: new Date(Date.now())});
    res.send('Logout successful' );
});

module.exports=authRouter;