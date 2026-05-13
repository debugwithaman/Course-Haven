import {User} from "../models/user.model.js";

export const signup = async(req,res)=>{
  const {firstName,lastName,email,password} = req.body;

 try {
   const existingUser = await User.findOne({email:email});
  if(existingUser){
    return res.status(400).json({error:"User already exists with this email"});
  }
  
  const newUser = new User({
    firstName,
    lastName,
    email,
    password,
  });

  await newUser.save();
  res.status(201).json({message:"User signed up successfully",newUser});

 } catch (error) {
  console.log("Error in user signup",error);
  res.status(500).json({error:"Server error while signing up user.."})
 }
}
