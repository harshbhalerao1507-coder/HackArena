import mongoose from "mongoose";

const studentSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    education:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    college:{
        type:String,
        required:true
    },
    skills:{
        type:[String]
    },


},{timestamps:true})
const Student=mongoose.model("Student",studentSchema);
export default Student