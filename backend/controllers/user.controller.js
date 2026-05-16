import {User} from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import * as z from "zod";
import jwt from "jsonwebtoken";
import config from "../config.js";

export const signup = async(req,res)=>{
  const {firstName,lastName,email,password} = req.body;

  const userSchema = z.object({
    firstName:z.string().min(2,{message:"First name must be at least 2 characters long"}),
    lastName:z.string().min(2,{message:"Last name must be at least 2 characters long"}),
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"Password must be at least 6 characters long"})
  });

  const validatedData = userSchema.safeParse(req.body);

  if(!validatedData.success){
    return res.status(400).json({error:validatedData.error.issues.map(err => err.message)});
  }
  
  const hashedPassword = await bcryptjs.hash(password,10);
 try {
   const existingUser = await User.findOne({email:email});
  if(existingUser){
    return res.status(400).json({error:"User already exists with this email"});
  }
  
  const newUser = new User({
    firstName,
    lastName,
    email,
    password:hashedPassword,
  });

  await newUser.save();
  res.status(201).json({message:"User signed up successfully",newUser});

 } catch (error) {
  console.log("Error in user signup",error);
  res.status(500).json({error:"Server error while signing up user.."})
 }
}

export const login = async(req,res)=>{
  const {email,password} = req.body;

  try {
    const user = await User.findOne({email:email});
    const isPasswordCorrect = await bcryptjs.compare(password,user.password);

    if(!user || !isPasswordCorrect){
      return res.status(403).json({error:"Invalid email or password"});
    }
    
    // JWT Code:
    const token = jwt.sign({
      id:user._id
      
    },config.JWT_USER_PASSWORD);

    res.cookie("jwt",token)
    res.status(201).json({message:"User logged in successfully",token,user});
    
  } catch (error) {
    console.log("Error in login",error);
    res.status(500).json({error:"Server error while logging in user.."})
    
  }
}

export const logout = async(req,res)=>{
  try {
    res.clearCookie("jwt");
    res.status(200).json({message:"User logged out successfully"});
  } catch (error) {
    console.log("Error in logout",error);
    res.status(500).json({error:"Server error while logging out user.."})
  }
}