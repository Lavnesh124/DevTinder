const express = require('express');
const { UserAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const User = require('../models/user');
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

userRouter.get('/connections',UserAuth, async (req,res)=>{
    try{
        const loggedInUser=req.user;
        
        const ConnectionRequests=await ConnectionRequest.find({
            $or:[{
                fromUserId:loggedInUser._id,
                status:'accepted'
            },
            {
                toUserId:loggedInUser._id,
                status:'accepted'
            }]
        }) 
           .populate("fromUserId toUserId",["firstname","lastname","email"])
           .populate("toUserId",["firstname","lastname","email"])   ;

        const data=ConnectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        });

        res.json({message:"Data fetched successfully",data:ConnectionRequests   
            });
        

    }catch(err){
        console.error('Error fetching connections:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


userRouter.get('/feed',UserAuth, async (req,res)=>{
    // console.log("feed api called");
    try{
        //User should not see the profile
        //his own Profile
        //his connections profile
        //ignored people profile
        //allready send connection request to those profiles

        const loggedInUser=req.user;
        const page=parseInt(req.query.page) || 1;
        const limit= parseInt(req.query.limit) || 10;
        limit =limit>50 ? 50 : limit; // Set a maximum limit of 50 to prevent abuse
        const skip=(page-1)*limit;
      //  console.log("Logged in user: ",loggedInUser.firstname);

        const connectionsRequests=await ConnectionRequest.find({
            $or:[{
                fromUserId:loggedInUser._id,
            },
            {
                toUserId:loggedInUser._id,
            }]
        }).select("fromUserId toUserId");

       // console.log("Connections Requests: ",connectionsRequests);


        const hideUsersFromFeed=new Set();

        connectionsRequests.forEach((row)=>{
            hideUsersFromFeed.add(row.fromUserId.toString());
            hideUsersFromFeed.add(row.toUserId.toString());
        })



        const users=await User.find({
            $and:[
                {
                     _id:{$nin:[...hideUsersFromFeed,loggedInUser._id]},
                },
                {
                    _id:{$ne:loggedInUser._id}
                }
            ]
        }).select("firstname lastname about skills photoUrl").skip(skip).limit(limit); // Fetch only the name and profile picture of the users

        res.send(users);

    }catch(err){
        console.error('Error fetching feed:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


module.exports = userRouter;