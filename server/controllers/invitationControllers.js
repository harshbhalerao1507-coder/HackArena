import Hackathon from "../models/Hackathon.js";
import Team from "../models/Team.js";
import Student from "../models/Student.js"
import TeamInvitation from "../models/TeamInvitation.js";
import User from "../models/User.js";
import crypto from "crypto"
import sendEmail from "../utils/sendEmail.js";
import axios from "axios";

export const sendInvitation=async(req,res)=>{
    try{
        const {teamId}=req.params;
        const {email,name}=req.body;
        if(!teamId || !email || !name){
            return res.status(400).json({
                message:"Invalid Details"
            })
        }
        const team = await Team.findById(teamId);
        if(!team){
            return res.status(404).json({
                message:"Team not found"
            })
        }
        const user=req.user;
        const student=await Student.findOne({user:user._id})
        if(!student){
            return res.status(404).json({
                message:"Student does not Exist"
            })
        }
        if(student._id.toString()!==team.leader.toString()){
            return res.status(403).json({
                message:"Only Team Leader can invite members"
            })
        }
        const hackathon=await Hackathon.findById(team.hackathon)
        if(!hackathon){
            return res.status(404).json({
                message:"Hackathon not Found"
            })
        }
        if(team.members.length >= hackathon.reqMembers){
            return res.status(400).json({
                message:"Team is full"
            })
        }
        const invitedUser=await User.findOne({email})
        if(!invitedUser){
            return res.status(404).json({
                message:"The user has not registered to HackArena"
            })
        }

        const invitedStudent = await Student.findOne({
            user:invitedUser._id
        })
        if(invitedStudent){
            const already =  team.members.some(
            member=> member.toString() === invitedStudent._id.toString()
        );
        if(already){
            return res.status(400).json({
                message:"Student already member of the team"
            })
        }
        }
        const existingInvitation=await TeamInvitation.findOne({
            team:team._id,
            email:email,
            status:"Pending"
        })
        if(existingInvitation){
            return res.status(400).json({
                message:"Invitation already sent"
            })
        }
        const token =crypto.randomBytes(32).toString("hex");
        const expiresAt=new Date(Date.now() + 24*60*60*1000)
        const invitation = await TeamInvitation.create({
            team:team._id,
            email:email,
            name:name,
            student:invitedStudent ? invitedStudent._id:undefined,
            token:token,
            status:"Pending",
            expiresAt:expiresAt
        })
        const invitationLink =
        `${process.env.FRONTEND_URL}/invitation/${invitation.token}`;
        await sendEmail(
        email,
        `Invitation to join ${team.teamName}`,
        `
            <h2>You've been invited to join HackArena!</h2>

            <p>Hello ${name},</p>

            <p>
                You have been invited to join
                <strong>${team.teamName}</strong>.
            </p>

            <p>
                Click below to view your invitation:
            </p>

            <a href="${invitationLink}">
                View Invitation
            </a>

            <p>
                You will need to login or register on HackArena
                before accepting or rejecting the invitation.
            </p>
        `
    );
        return res.status(200).json({
            message:"Invite sent sucessfully",
            invite:invitation
        })
    
    }
    catch(e){
        return res.status(500).json({
            error:e.message
        })
    }
}

export const acceptInvitation=async(req,res)=>{
    try
    {const {token}=req.params;
    if(!token){
        return res.status(404).json({
            message:"Token not found"
        })
    }
    const invitation = await TeamInvitation.findOne({token:token})
    if(!invitation){
        return res.status(404).json({
            message:"Invitation not found"
        })
    }
    if(invitation.status !=="Pending"){
        return res.status(400).json({
            message:"Invitation is no longer valid"
        })
    }
    if(Date.now()>invitation.expiresAt){
        invitation.status="Expired";
        await invitation.save();
        return res.status(400).json({
            message:"Invitation Expired"
        })
    }

    const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
    
    if(user.email!=invitation.email){
        return res.status(403).json({
            message:"Not your Invitation"
        })
    }
    const student=await Student.findOne({user:user._id})
    if(!student){
        return res.status(404).json({
            message:"Student not found"
        })
    }
    const team = await Team.findById(invitation.team);
    if(!team){
        return res.status(404).json({
            message:"Team not found"
        })
    }
    const hackathon=await Hackathon.findById(team.hackathon);
    if(!hackathon){
        return res.status(404).json({
            message:"Hackathon not found"
        })
    }
    if(team.members.length>=hackathon.reqMembers){
        return res.status(400).json({
            message:"Team is already full"
        })
    }
    const existingTeam=await Team.findOne({
        hackathon:hackathon._id,
        members:student._id
    });
    if(existingTeam){
        return res.status(400).json({
            message:"You are already in a team in this Hackathon"
        })
    }
    team.members.push(student._id)
    await team.save()
    invitation.status="Accepted"
    invitation.student=student._id;
    await invitation.save()
    return res.status(200).json({
        message:"Invitation Accepted successfully"
    })}
    catch(e){
        return res.status(500).json({
            error:e.message
        })
    }

}

export const rejectInvitation=async(req,res)=>{
    try
    {const {token}=req.params;
    if(!token){
        return res.status(404).json({
            message:"Token not found"
        })
    }
    const invitation = await TeamInvitation.findOne({token:token})
    if(!invitation){
        return res.status(404).json({
            message:"Invitation not found"
        })
    }
    if(invitation.status !=="Pending"){
        return res.status(400).json({
            message:"Invitation is no longer valid"
        })
    }
    if(Date.now()>invitation.expiresAt){
        invitation.status="Expired";
        await invitation.save();
        return res.status(400).json({
            message:"Invitation Expired"
        })
    }
    const user=req.user;
    if(user.email!=invitation.email){
        return res.status(403).json({
            message:"Not your Invitation"
        })
    }
    const student=await Student.findOne({user:user._id})
    if(!student){
        return res.status(404).json({
            message:"Student not found"
        })
    }    
    invitation.status="Rejected"
    
    await invitation.save()
    return res.status(200).json({
        message:"Invitation Rejected successfully"
    })}
    catch(e){
        return res.status(500).json({
            error:e.message
        })
    }

}

export const getInvitations=async(req,res)=>{
    try{
        
        const user=req.user;
        const student=await Student.findOne({user:user._id});
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            })
        }
        
        const invitations = await TeamInvitation.find({
                student: student._id,
                status: "Pending"
            }).populate({
                path: "team",
                populate: {
                    path: "hackathon"
                }
            });
        res.status(200).json({
            Invitations:invitations
        })
    }
    catch(e){
        res.status(500).json({
            error:e.message
        })
    }
}
