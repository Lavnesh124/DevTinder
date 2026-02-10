const express=require('express');
const User=require('../models/user');
const { UserAuth }=require('../middlewares/auth'); // Import the authentication middleware           
const {validateEditProfileData}=require('../utils/validation'); // Import the validation function

const profilrRouter=express.Router();

profilrRouter.get('/view',UserAuth,async (req,res)=>{
    try{
        const user=req.user;
        console.log(user);
        res.send(user);
    }catch(err){
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



profilrRouter.patch('/update',UserAuth,async (req,res)=>{
    try{
        if(!validateEditProfileData(req)){
            throw new Error('Invalid profile update data');
        }

        const loggedInUser=req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key]=req.body[key]));
        await loggedInUser.save();
        res.send("Profile updated successfully!");

    }catch(err){
        console.error('Error updating profile:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


profilrRouter.patch('/password',UserAuth,async (req,res)=>{
    try{
        const loggedInUser=req.user;
        const passwordHash=await bcrypt.hash(req.body.password,10);
        loggedInUser.password=passwordHash;
        await loggedInUser.save();
        res.send("Password updated successfully!");

    }catch(err){
        console.error('Error updating password:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports=profilrRouter;