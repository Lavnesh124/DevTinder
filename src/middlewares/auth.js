const jwt = require('jsonwebtoken');
const User=require('../models/user');

const UserAuth= async(req, res, next) => {
    try{
          //Read the token from the cookies
            const cookies=req.cookies;
    
            const { token }=cookies;

            if(!token){
                throw new Error('No token found in cookies');
            }
            const decodedObj=await jwt.verify(token,"devtinder_secret_key");

            const { _id }=decodedObj;

            const user= await User.findOne({_id:_id});

            if(!user){
                return res.status(404).json({ message: 'User not found' });
            }
            req.user=user;
            next(); 
    }catch(err){
        console.error('Error during authentication:', err);
        res.status(401).json({ message: 'Unauthorized' });
    }
    


    
}

module.exports={UserAuth};