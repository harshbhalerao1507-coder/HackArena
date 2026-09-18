import mongoose from "mongoose";

const submissionSchema=new mongoose.Schema({
    team:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Team",
        required:true
    },
    hackathon:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hackathon",
        required:true
    },
    ppt:{
        type:String,
        required:true
    },
    submittedAt:{
        type:Date,
        default:Date.now(),
        required:true
    }



},{
    timestamps:true
});

const Submission=mongoose.model("Submission",submissionSchema)
export default Submission