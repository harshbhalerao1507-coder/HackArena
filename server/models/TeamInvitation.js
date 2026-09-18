import mongoose from "mongoose";

const teamInvitationSchema=new mongoose.Schema({
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },
    email:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    student:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student"
    },
    token:{
        type:String,
        required:true,
        
    },
    status:{
        type:String,
        enum:["Pending","Accepted","Rejected","Expired"],
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    }
},{timestamp:true})

const TeamInvitation=mongoose.model("TeamInvitation",teamInvitationSchema)
export default TeamInvitation