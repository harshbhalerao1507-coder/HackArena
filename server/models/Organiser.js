import mongoose from "mongoose";

const organiserSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    organisation:{
        type:String,
        required:true
    },
    organisationDescription:{
        type:String,
        required:true
    }


},{timestamps:true})
const Organiser=mongoose.model("Organiser",organiserSchema);
export default Organiser;