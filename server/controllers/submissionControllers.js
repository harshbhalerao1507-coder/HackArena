import Student from "../models/Student.js";
import Submission from "../models/Submission.js";
import Team from "../models/Team.js";
import Hackathon from "../models/Hackathon.js"
import cloudinary from "../config/cloudinary.js";


export const uploadToCloudinary=(buffer)=>{
    return new Promise(
        (resolve,reject)=>{
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type:"raw"
                },
                (error,result)=>{
                    if(error){
                        reject(error)
                    }
                    else{
                        resolve(result)
                    }
                }
            );
            stream.end(buffer);
        }
    );
};

export const createSubmission=async (req,res)=>{
    try{
        const {teamId}=req.body;
        const user=req.user;
        if(!teamId){
            return res.status(400).json({
                message:"Invalid details"
            })
        }
        if(!req.file){
            return res.status(404).json({
                message:"Please Upload the file"
            })
        }
        const student=await Student.findOne({user:user._id});
        if(!student){
            return res.status(400).json({
                message:"Student not found"
            })
        }
        const team=await Team.findById(teamId);
        if(!team){
            return res.status(404).json({
                message:"Team not found"
            })
        }
        const hackathon = await Hackathon.findById(team.hackathon);
        if(!hackathon){
            return res.status(404).json({
                message:"Hackathon not found"
            })
        }
        const isMember = team.members.some(
            member => member.toString() === student._id.toString()
        );

        if (!isMember) {
            return res.status(400).json({
                message: "You are not a member of the team"
            });
        }

        if (team.members.length < hackathon.reqmembers) {
            return res.status(400).json({
                message: "Team is not eligible for submission"
            });
        }
        if(Date.now()<hackathon.subStart){
            return res.status(400).json({
                message:"Submissions not Started yet"
            })
        }
        if(Date.now()>hackathon.subEnd){
            return res.status(400).json({
                message:"Submissions closed"
            })
        }
        const exisitingSubmission=await Submission.findOne({
            team:teamId,
            hackathon:hackathon._id
        })
        if(exisitingSubmission){
            return res.status(400).json({
                message:"Your team has already submitted"
            })
        }
        const result = await uploadToCloudinary(req.file.buffer);
        const submission=await Submission.create({
            team:team._id,
            hackathon:hackathon._id,
            ppt:result.secure_url,
            submittedAt:new Date()

        })
        return res.status(200).json({
            message:"Ppt submitted successfully",
            Submission:submission
        })
        
    }
    catch(e){
        return res.status(500).json({
            error:e.message
        })
    }
}