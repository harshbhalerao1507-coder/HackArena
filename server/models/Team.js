import mongoose from "mongoose"
const teamSchema=new mongoose.Schema({
    teamName:{
        type:String,
        required:true
    },
    hackathon:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hackathon",
        required:true
    },
    leader:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Student",
        required:true
    },
    members:{
        type:[mongoose.Schema.Types.ObjectId],
        ref:"Student"
    },
    problemStatement:{
        type:String
        
    }

},{timestamps:true})

const Team=mongoose.model("Team",teamSchema)
export default Team;