import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res,next) =>{
    
    const {username , email, password} = req.body;
    const hashPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({username , email, password:hashPassword});
    try{
        await newUser.save();
        res.status(201).json("User created successfully!");
    }catch(err){
        // res.status(501).json(err.message);
        next(err);
        // this next we are using becuz of the middleware that we implemented into the index.js file so now we are getting more detailes and specific error

    }
};

export const signin = async (req, res, next) =>{
    const {email , password} = req.body;
    try{
        const validUser = await User.findOne({email});
        if(!validUser) return next(errorHandler(404, "user not found"));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if(!validPassword) return next(errorHandler(400 , "wrong credentials"));
        const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...rest} = validUser._doc; // this is used to remove the password from the user object
        res.cookie('access_token', token , { httpOnly: true}).status(200).json(rest);
    }
    catch(err){
        next(err);
    }
}