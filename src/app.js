const express=require('express');

const app=express();


app.get("/user",(req,res)=>{
    res.send("Hello from the server!");
});

app.use("/test",(req,res,next)=>{
   res.send("Hello from the server!");
});


app.listen(7777,()=>{
    console.log('Server is running on port 7777');
});