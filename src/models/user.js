const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    bio:{
        type:String
    },
    age:{
        type:Number
    },
    gender:{
        type:String,
        enum:['male','female','other']
    }
});

const User=mongoose.model('User',userSchema);

module.exports=User;