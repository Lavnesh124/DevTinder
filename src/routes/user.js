const express = require('express');
const { UserAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const userRouter = express.Router();



// Getting all the pending connection requests
userRouter.get('/requests/received',UserAuth, async (req,res)=>{
    try{
        const loggedInUser=req.user;

        const connectionsRequests= await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:'interested'
        }).populate("fromUserId",["firstname","lastname","email"]); // Populate the fromUserId field with user details (name and profile picture)

        res.json({message:"Data fetched successfully",data:connectionsRequests});




    }catch(err){
        console.error('Error fetching connection requests:', err);
        res.status(500).json({ message: 'Internal server error' });
    }

})


module.exports = userRouter;