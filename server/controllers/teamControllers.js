import Hackathon from "../models/Hackathon.js";
import Team from "../models/Team.js";
import Student from "../models/Student.js"
import TeamInvitation from "../models/TeamInvitation.js";
import User from "../models/User.js";
import crypto from "crypto"
import sendEmail from "../utils/sendEmail.js";
import axios from "axios";
export const getTeams=async(req,res)=>{
    
        const teams=await Team.find({});
        res.status(200).json({
            Teams:teams
        })

       
}
export const getTeamById=async(req,res)=>{
        try
        {
        const id=req.params.id;
        if(!id){
            return res.status(404).json({
                message:"Id not found"
            })
        }
        const teams=await Team.findById(id);
        res.status(200).json({
            Teams:teams
        })}
        catch(e){
            res.status(500).json({
                error:e.message
            })
        }

       
}
export const createTeam=async(req,res)=>{
    try{
        console.log("CREATE TEAM HIT");
        console.log("BODY:", req.body);
        console.log("USER:", req.user);
        const {teamName,hackathonid}=req.body;
        const user=req.user;
        if(!teamName || !hackathonid){
            return res.status(400).json({
                message:"Invalid details"
            })
        }
        if(user.role !="Student"){
            return res.status(403).json({
                message:"Acess Denied"
            })
        }
        const hackathon=await Hackathon.findById(hackathonid);
        if(!hackathon){
            return res.status(404).json({
                message:"Hackathon Not found"
            })
        }
        const student=await Student.findOne({user:user._id});
        if(!student){
            return res.status(404).json(
                {
                    message:"Cant find Student"
                }
            )
        }
        if(Date.now()<hackathon.regStart){
            return res.status(403).json({
                message:"registrations not started yet"
            })
        }

        if(Date.now()>hackathon.regEnd){
            return res.status(403).json({
                message:"registrations Closed"
            })
        }

        const existingTeam=await Team.findOne(
            {
                hackathon:hackathon._id,
                members:student._id
            }
        )
        if(existingTeam){
            return res.status(400).json(
                {
                    message:"You are already register with another Team"
                }
            )
        }
        const team=await Team.create({
            teamName:teamName,
            hackathon:hackathon._id,
            leader:student._id,
            members:[student._id]
        })
        return res.status(200).json({
            message:"Team created Successfully",
            team:team
        })



    }
    catch(e){
        return res.status(500).json({
            error:e.message
        })
    }
}

export const deleteTeamById=async(req,res)=>{
        try
        {
        const id=req.params.id;
        if(!id){
            return res.status(404).json({
                message:"Id not found"
            })
        }
        const Team=await Team.findByIdAndDelete(id);
        res.status(200).json({
            Teams:teams
        })}
        catch(e){
            res.status(500).json({
                error:e.message
            })
        }

       
}

export const updateTeamById=async(req,res)=>{
    
        try
        {
        const id=req.params.id;
        const updates=req.body;
        if(!id){
            return res.status(404).json({
                message:"Id not found"
            })
        }
        const teams=await Team.findByIdAndUpdate(id,updates,{new:true});
        res.status(200).json({
            Teams:teams
        })}
        catch(e){
            res.status(500).json({
                error:e.message
            })
        }

       
}

export const getTeamsByUser = async (req, res) => {
    try {
        const user = req.user;

        const student = await Student.findOne({
            user: user._id
        });

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const teams = await Team.find({
            members: student._id
        })
        .populate("members")
        .populate("leader")
        .populate("hackathon");

        res.status(200).json({
            Teams: teams
        });

    } catch (e) {
        console.log("GET MY TEAMS ERROR:", e);

        res.status(500).json({
            error: e.message
        });
    }
};