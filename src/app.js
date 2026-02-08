const express=require('express');


const app=express();
const {UserAuth}=require('./middlewares/auth');


app.get("/getUserData",UserAuth,(req,res)=>{
    try{
        res.send("User data accessed successfully");
    }
    catch(err){
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
    
});

app.use("/test",(req,res,next)=>{
   res.send("Hello from the server!");
});


app.listen(7777,()=>{
    console.log('Server is running on port 7777');
});