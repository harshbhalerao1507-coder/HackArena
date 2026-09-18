import User from "../models/User.js"
import Student from "../models/Student.js"
import Organiser from "../models/Organiser.js";
import jwt from "jsonwebtoken";
const createTokens=(user)=>{
    return jwt.sign({_id:user._id,role:user.role},process.env.SECRET,{expiresIn:process.env.EXPIRE});
}
export const login=async (req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await User.login(email,password);
        const token=createTokens(user);
        res.status(200).json({
            message:"Logged In",
            user,
            tokens:token
        });
    }
    catch(e){
        res.status(400).json({error:e.message});
    }
}

export const register=async (req,res)=>{
    const {name,email,password,phone,education,address,college,skills,organisation,organisationDescription,role}=req.body;
    try{
        const user=await User.register(name,email,password,phone,role);
        if(role=="Student"){
            const student=await Student.create({user:user._id,education,address,college,skills});
        }
        if(role=="Organiser"){
            const organiser=await Organiser.create({user:user._id,organisation,organisationDescription})
        }                                 
        const token = createTokens(user);
        res.status(200).json({user,token});
    }
    catch(e){
        res.status(400).json({error:e.message});
        
    }
}
