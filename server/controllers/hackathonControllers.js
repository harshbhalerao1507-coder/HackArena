import Hackathon from "../models/Hackathon.js"
import Organiser from "../models/Organiser.js"
import Student from "../models/Student.js";
import Registration from "../models/Registration.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../controllers/submissionControllers.js";


export const getHackathons = async (req, res) => {
    try {
        const hackathons = await Hackathon.find({}).lean();

        let registeredHackathonIds = new Set();
        if (req.user.role === "Student") {
            const student = await Student.findOne({ user: req.user._id }).select("_id");
            if (!student) {
                return res.status(404).json({ message: "Student not found" });
            }

            const registrations = await Registration.find({ student: student._id }).select("hackathon");
            registeredHackathonIds = new Set(registrations.map((registration) => registration.hackathon.toString()));
        }

        res.status(200).json({
            Hackathons: hackathons.map((hackathon) => ({
                ...hackathon,
                isRegistered: registeredHackathonIds.has(hackathon._id.toString())
            }))
        });

    } catch (e) {
        res.status(500).json({
            error: e.message
        });
    }
};

export const registerForHackathon = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid hackathon id" });
        }

        const student = await Student.findOne({ user: req.user._id });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        const hackathon = await Hackathon.findById(id);
        if (!hackathon) {
            return res.status(404).json({ message: "Hackathon not found" });
        }

        const now = new Date();
        if (now < hackathon.regStart || now > hackathon.regEnd) {
            return res.status(403).json({ message: "Registration is not currently open" });
        }

        const existingRegistration = await Registration.findOne({
            student: student._id,
            hackathon: hackathon._id
        });
        if (existingRegistration) {
            return res.status(409).json({ message: "You are already registered for this hackathon" });
        }

        const registration = await Registration.create({
            student: student._id,
            hackathon: hackathon._id
        });

        return res.status(201).json({
            message: "Registration successful",
            registration
        });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({ message: "You are already registered for this hackathon" });
        }
        return res.status(500).json({ error: e.message });
    }
};

export const createHackathons=async(req,res)=>{
    try{
        const {title,description,startDate,endDate,regStart,regEnd,subStart,subEnd,reqmembers,rules}=req.body;
        if(!title || !description || !startDate || !endDate || !regStart || !regEnd || 
            !subStart || !subEnd || !reqmembers || !rules ||!req.file){
            return res.status(400).json({
                message:"Invalid Details"
            })
        }
        const organiser=await Organiser.findOne({
            user:req.user._id
        })
        if(!organiser){
            return res.status(404).json({
                message:"Organiser not found"
            })
        }
        const result = await uploadToCloudinary(req.file.buffer);

        const hackathon = await Hackathon.create({title,description,organiser:organiser._id,startDate,endDate,regStart,regEnd,subStart,subEnd,reqmembers,rules,ps:result.secure_url});
        res.status(200).json({
            Hackathon:hackathon
        })
    }
    catch(e){
        return res.status(500).json({
            error:e.message
        })
    }
}

export const getHackathonsbyId=async(req,res)=>{
    const id=req.params.id;
    if(!id){
        return res.status(404).json({
            message:"Id not Found"
        })
    }
    try{const hackathon=await Hackathon.findById(id)
    res.status(200).json({
        Hackathons:hackathon
    })
    }
    catch(e){
        res.status(500).json({
            Error:e.message
        })
    }
}

export const deleteHackathon=async(req,res)=>{
    try{const id =req.params.id;
    if(!id){
        return res.status(404).json({
            message:"Id not found"
        })
    }
    const hackathon=await Hackathon.findByIdAndDelete(id)
    res.status(200).json({
        message:"Deleted hackathon",
        Hackathon:hackathon
    })}
    catch(e){
        res.status(500).json({
            error:e.message
        })
    }
}

export const updateHackathon=async(req,res)=>{
    try{
        const id=req.params.id;
        const updates=req.body;
        if(!id){
            res.status.json({
                message:"Id not found"
            })
        }
        const hackathon=await Hackathon.findByIdAndUpdate(id,updates,{new:true})
        res.status(200).json({
            Hackathon:hackathon
        })
    }
    catch(e){
        res.status(500).json({
            error:e.message
        })
    }
}
