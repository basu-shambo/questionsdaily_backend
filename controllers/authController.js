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
    if(error) return res.status(400).send({message:error.details[0].message});

    //checking if the email already exists
    try{
        const alreadyUser = await userModel.findOne({emailId});
        if(alreadyUser) return res.status(400).send({"message":"User alrady Exists"})
        const salt = await bcrypt.genSalt(12);
        const hashPassword = await bcrypt.hash(password,salt);
        const newUser = new userModel({
            firstName,lastName,emailId,password:hashPassword
        });
        const savedUser = await newUser.save();
        res.status(200).json({result:savedUser})

    }catch(err){
        res.status(500).json({message:"SignUp Failed"})
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
    if(error) return res.status(400).send(error.details[0].message);

    try{
        //checking if the user exists
        const alreadyUser = await userModel.findOne({emailId});
        if(!alreadyUser) return res.status(400).send("Invalid email Id or password");
    
        //verifying the password
        const checkPass = await bcrypt.compare(password,alreadyUser.password);
        if(!checkPass) return res.status(400).send("Invalid emailId or password");
    
        const secret = process.env.TOKEN_SECRET;
        const token = jwt.sign({_id:alreadyUser._id},secret,{expiresIn:"1h"});
        res.status(200).json({result:alreadyUser, token})
    }catch(err){
        res.status(500).json({"message":"Login Failed"});
    }
    
    

}