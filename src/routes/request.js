const express = require('express');
const { validateSignupData } = require('../utils/validation'); // Import the validation function         
const { UserAuth }=require('../middlewares/auth'); // Import the authentication middleware           


const requestRouter=express.Router();

requestRouter.get('/sendConnectionRequest',UserAuth,async (req,res)=>{
    const user =req.user;
    console.log("Sending a connection request!");

    res.send(user.firstname +"sent the connect request!");
});

module.exports=requestRouter;