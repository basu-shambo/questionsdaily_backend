import userModel from '../models/userModel.js';
import joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const verifySignUp = (data) =>{
    const signupSchema = joi.object({
        firstName:joi.string().alphanum().required().min(3).max(30),
        lastName: joi.string().alphanum(),
        emailId: joi.string().email({tlds:{allow:false}}).required(),
        password:joi.string().required().min(8),
        cpassword:joi.ref('password')
    })
    return signupSchema.validate(data);
}
export const signup = async(req,res)=>{
    const {firstName,lastName,emailId,password} = req.body;
    const {error} = verifySignUp(req.body);
    if(error) return res.status(400).json({error:{ type:"signup",details:error}});

    //checking if the email already exists
    try{
        const alreadyUser = await userModel.findOne({emailId});
        if(alreadyUser) return res.status(400).json({error:{type:"signup",details:{message:"Email already exist",path:"emailId"}}});
    
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password,salt);
        const newUser = new userModel({
            firstName,lastName,emailId,password:hashPassword
        });
        const savedUser = await newUser.save();
        res.status(200).json({result:savedUser._id})

    }catch(error){
        res.status(500).json({error:{type:"signup",details:{message:"Unknwown server error",path:undefined}}});
    
    }
    
}


const verifyLogin = (data) =>{
    const loginSchema = joi.object({
        emailId: joi.string().required().email(),
        password: joi.string().required()
    });

    return loginSchema.validate(data);
}

export const login = async (req,res) =>{
    const {emailId,password} = req.body;
    const {error} = verifyLogin(req.body);
    if(error) return res.status(400).json({error:{ type:"authentication",details:error}});

    try{
        //checking if the user exists
        const alreadyUser = await userModel.findOne({emailId});
        if(!alreadyUser) return res.status(400).json({error:{type:"authentication",details:{message:"Email doesn't exist",path:"emailId"}}});
    
        //verifying the password
        const checkPass = await bcrypt.compare(password,alreadyUser.password);
        if(!checkPass) return res.status(400).json({error:{type:"authentication",details:{message:"Password is wrong",path:"password"}}});
    
        const secret = process.env.TOKEN_SECRET;
        const token = jwt.sign({_id:alreadyUser._id},secret,{expiresIn:"1h"});
        res.status(200).json({result:alreadyUser, token})
    }catch(err){
        res.status(500).json({error:{type:"authentication",details:{message:"Something went wrong",path:undefined}}});
    }
    
    

}