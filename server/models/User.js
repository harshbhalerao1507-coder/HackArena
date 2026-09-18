import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    
    email:{
        type:String,
        required:true
    },

    password:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Organiser","Student"],
        default:"Student"

    }


},{timestamps:true});

userSchema.statics.register=async function(name,email,password,phone,role){
    const exists=await this.findOne({email});
    if(exists){
        throw new Error("Email Already Exists");
    }
    if(!name || !email || !password || !phone || !role){
        throw new Error("Fill all the required fields");
    }
    if(!validator.isEmail(email)){
        throw new Error("Invalid Email Address");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("Create a Strong Password");
    }

    const salt= await bcrypt.genSalt(10);
    const hash= await bcrypt.hash(password,salt);
    const user= await this.create({
    name,
    email,
    password:hash,
    phone,
    role})

    return user;
    
   
}

userSchema.statics.login=async function(email,password){
    if(!email || !password){
        throw new Error("Fill all required Fields");
    }
    const user=await this.findOne({email});
    if(!user){
        throw new Error("Email Address Doesnt Exists");
    }
    const match=await bcrypt.compare(password,user.password);
    if(!match){
        throw new Error("Incorrect Password");
    }
    return user;
}


const User=mongoose.model("User",userSchema);
export default User;