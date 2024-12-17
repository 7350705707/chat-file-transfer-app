import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import {renameSync,unlinkSync} from 'fs';

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email,userId) => {
    return jwt.sign({ email, userId }, process.env.JWT_KEY, {
        expiresIn: maxAge,
    });
    };

export const signup = async (req, res, next ) => {
  try {
    const {  email, password } = req.body;
    if(!email || !password) {
      return res.status(400).send("Email and password are required");   
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).send("User already exists");
    }
    const user = await User.create({  email, password });

    res.cookie("jwt", createToken(user.email, user._id), {
      httpOnly: true,
      maxAge: maxAge,
      SameSite: "None",
    });

    return res.status(201).json({user:{
        email: user.email,
        id: user._id,
        profileSetup: user.profileSetup,
    }});


  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }
    const user = await User.findOne({email});
    if (user) {

      const auth = await compare(password, user.password);
      if (!auth) {
        return res.status(400).send("Password is Incorrect");
      };
      res.cookie("jwt", createToken(user.email, user._id), {
        httpOnly: true,
        maxAge: maxAge,
        SameSite: "None",
      });
      return res.status(200).json({user:{
        email: user.email,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
        profileSetup: user.profileSetup,
    }});
    }else{
      return res.status(404).send("User with the given email not found");
    }
  } catch (error) {
    return res.status(400).send("Invalid credentials");
  };

};


export const getUserInfo = async (req, res, next) => {
  try {
    
      const userData = await User.findById(req.userId);
      if(!userData){
        return res.status(404).send("User not found");
      }

          return res.status(200).json({user:{
            email: userData.email,
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            image: userData.image,
            color: userData.color,
            profileSetup: userData.profileSetup,
        }});
  
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
}


export const updateProfile = async (req, res, next) => {
  try {
  
    const { firstName, lastName, color } = req.body;
    if(!firstName || !lastName || color === undefined) {
      return res.status(400).send("First Name, Last Name and Color are required");
    }
    const userData  = await User.findById(req.userId);  
    if(!userData){
      return res.status(404).send("User not found");
    }
    const updated = await User.findByIdAndUpdate(req.userId, { firstName, lastName, color,profileSetup:true }, { new: true, runValidators: true });
    return res.status(200).json({user:{
      email: updated.email,
      id: updated._id,
      firstName: updated.firstName,
      lastName: updated.lastName,
      image: updated.image,
      color: updated.color,
      profileSetup: updated.profileSetup,
  }});
  }
  catch (error) {
    return res.status(400).send("Invalid token");
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    console.log('hrer');
    if(!req.file){ 
      return res.status(400).send("Image is required");
    }
    
    const date = Date.now();
    let fileName = `uploads/profiles/${date}-${req.file.originalname}`;

    renameSync(req.file.path,fileName);
    
    const updatedUser = await User.findByIdAndUpdate(req.userId, { image:fileName }, { new: true, runValidators: true });
    return res.status(200).json({image: updatedUser.image});
  
}catch (error) {
    return res.status(400).send("Invalid token");
  }
};


export const removeProfileImage = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);
    if(!userData){
      return res.status(404).send("User not found");
    }
    if(userData.image){
      unlinkSync(userData.image);
    }
    
    userData.image = null;
    await userData.save();
    return res.status(200).send("Image removed successfully");
  }
  catch (error) {
    return res.status(400).send("Invalid token");
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "haresh", { maxAge: 1, SameSite:"lax" });
    return res.status(200).send("Logged out successfully");
  } catch (error) {
    return res.status(400).send("Invalid token");
  }
};