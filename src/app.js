const express=require('express');
const connectDB=require('./config/database'); // Connect to the database
const User=require('./models/user'); // Import the User model
const app=express();


app.use(express.json()); // Middleware to parse JSON bodies


app.post('/signup', async (req,res)=>{
        //creating a new instance of User model with the data from the request body
        const user= new User(req.body);
    try{
        await user.save();  
        res.status(201).json({ message: 'User created successfully' });
    }
    catch(err){
        console.error('Error during signup:', err);
        res.status(500).json({ message: 'Internal server error' });
    }

});


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
});``



connectDB().then(()=>{
    console.log('Database connected successfully');
    app.listen(7777,()=>{
        console.log('Server is running on port 7777');
    });
}).catch((err)=>{
    console.error('Database connection failed:', err);
    process.exit(1); // Exit the application if the database connection fails
});



