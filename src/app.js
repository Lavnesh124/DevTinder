const express=require('express');


const app=express();
const {adminAuth,UserAuth}=require('./middlewares/auth');



app.use("/admin",adminAuth);



app.get("/admin/getAllData",(req,res)=>{
    res.send("Get all data from the server!")
});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("Delete user from the server!");
});



app.get("/user",UserAuth,(req,res)=>{
    res.send("Hello from the server!");
});

app.use("/test",(req,res,next)=>{
   res.send("Hello from the server!");
});


app.listen(7777,()=>{
    console.log('Server is running on port 7777');
});