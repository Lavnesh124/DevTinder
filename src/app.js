const express=require('express');
const connectDB=require('./config/database'); // Connect to the database
const User=require('./models/user'); // Import the User model
const { validateSignupData } = require('./utils/validation'); // Import the validation function
const bcrypt=require('bcrypt'); // Import bcrypt for password hashing
const cookieParser=require('cookie-parser'); // Import cookie-parser for handling cookies
const jwt=require('jsonwebtoken'); // Import jsonwebtoken for token handling


const app=express();


app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies


app.post('/signup', async (req,res)=>{
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

app.post('/login',async (req,res)=>{
    const { email,password } = req.body;
    try{
        const user= await User.findOne({email:email});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(401).json({ message: 'Invalid password' });
        }
        // Creating a JWT token 

        const token=await jwt.sign({ _id:user._id}, "devtinder_secret_key");
        console.log(token);
        res.cookie("token",token);
        res.json({ message: 'Login successful' });
    }
    catch(err){
        console.error('Error during login:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/profile',async (req,res)=>{
    try{

        const cookies=req.cookies;

        const { token }=cookies;

        if(!token){
            throw new Error('No token found in cookies');
        }
        //Validating the tokens
        const decodedMessage=await jwt.verify(token,"devtinder_secret_key");
        const { _id} =decodedMessage;
        const user= await User.findOne({_id:_id});
        if(!user){
            return res.status(404).json({ message: 'User not found' });
        }   
        res.send(user);
    }catch(err){
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
})

//Get user by email
app.get('/users', async (req,res)=>{
      const userEmail=req.body.email;
    try{
        const users= await User.findOne({email:userEmail});
        if(!users){
            res.status(404).json({ message: 'Users not found' });
        } else {
            res.json(users); // Send the user data as a JSON response
        }
    }
    catch(err){
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/feed', async (req,res)=>{
    try{
        const users= await User.find();
        res.json(users); // Send the user data as a JSON response
    }
    catch(err){
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/user',async (req,res)=>{
    const userId=req.body.userId;
    try{
        const deletedUser= await User.findOneAndDelete({_id:userId});  
         res.json({ message: 'User deleted successfully', user: deletedUser});
    }catch(err){
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});             

app.patch('/user',async (req,res)=>{
    const userId=req.body.userId;
    const updateData=req.body.updateData;
    try{
        const updatedUser= await User.findOneAndUpdate({_id:userId},updateData,{new:true});  
         res.json({ message: 'User updated successfully', user: updatedUser});
    }catch(err){
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});





connectDB().then(()=>{
    console.log('Database connected successfully');
    app.listen(7777,()=>{
        console.log('Server is running on port 7777');
    });
}).catch((err)=>{
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the application if the database connection fails
});



