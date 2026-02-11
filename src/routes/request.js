const express = require('express');
const { validateSignupData } = require('../utils/validation'); // Import the validation function         
const { UserAuth }=require('../middlewares/auth'); // Import the authentication middleware           
const {ConnectionRequest}=require('../models/connectionRequest'); // Import the ConnectionRequest model
const { Connection } = require('mongoose');
const User=require('../models/user'); // Import the User model

const requestRouter=express.Router();

requestRouter.get('/send/:status/:toUserId',UserAuth,async (req,res)=>{
    try{
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;

        const allowedStatus=['ignored','interested'];
        if(!allowedStatus.includes(status)){
            return res.status(400).json({ message: 'Invalid status value' });
        }

        if(fromUserId==toUserId){
            return res.status(400).json({ message: 'Cannot send connection request to yourself' });
        }

        const toUser=await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({ message: 'Target user not found' });
        }

        //If ther is. existing ConnectionRequest between theses Users
        const ExistingConnectionRequest =await ConnectionRequest.findOne({
            $or:[{    
                fromUserId:fromUserId,
                toUserId:toUserId
            },
            {
                fromUserId:toUserId,
                toUserId:fromUserId
            }
            ]
        
        });

        if(ExistingConnectionRequest){
            return res.status(400).json({ message: 'Connection request already exists between these users' });
        }

     const connectionRequest=new ConnectionRequest({
        fromUserId,
        toUserId,
        status
     });

   //  console.log(req.user.firstName +" is sending a connection request to "+toUser.firstName+" with status "+status);


     const data=await connectionRequest.save();
     res.json({message: req.user.firstname +" Connection request sent successfully to "+toUser.firstname,data:data});


    }catch(err){
        console.error('Error sending interest:', err);
        res.status(500).json({ message: 'Internal server error' });
    }   
});

module.exports=requestRouter;