const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        enum:['ignored','interested','accepted','rejected'],
        message: `{VALUE} is not a valid status. Valid statuses are: 'pending','interested', 'accepted', 'rejected', 'ignored'`,
        default:'pending',
        required:true
    }
});


//Schema. index
connectionRequestSchema.index({ fromUserId: 1 , toUserId: 1});

const ConnectionRequest=mongoose.model('ConnectionRequest',connectionRequestSchema);

module.exports={ConnectionRequest
    }