const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        minlength:2,
        maxlength:50,
        index: true
    },
    lastname:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email format');
            }
        }
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Invalid password format');
            }
        }
    },
    about:{
        type:String,
        default:'the default about me section'
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        enum:['male','female','other']
    },
    photoUrl:{
        type:String,  
        validate(value){
            if( value && !validator.isURL(value)){
                throw new Error('Invalid URL format');
            }
        }
    },
    skills:{
        type:[String]       
    }   
},{timestamps:true});

const User=mongoose.model('User',userSchema);

module.exports=User;