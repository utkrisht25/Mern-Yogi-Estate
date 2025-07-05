import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

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