import mongoose from "mongoose";

const hackathonSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    organiser:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Organiser",
        required:true
    },
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    regStart:{
        type:Date,
        required:true
    },
    regEnd:{
        type:Date,
        required:true
    },
    subStart:{
        type:Date,
        required:true
    },
    subEnd:{
        type:Date,
        required:true
    },
    reqmembers:{
        type:String,
        required:true
    },
    rules:{
        type:String,
        required:true
    },
    ps:{
        type:String,
        required:true
    }
},{timestamps:true});

const Hackathon=mongoose.model("Hackathon",hackathonSchema);
export default Hackathon