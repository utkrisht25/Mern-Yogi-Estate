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
};

export const google = async (req, res, next) =>{
    try {
        const user = await User.findOne({ email : req.body.email })
        if(user){
            const token = jwt.sign({id : user._id} , process.env.JWT_SECRET);
            const { password: pass , ...rest} = user._doc;
            res.cookie('access_token' , token , {httpOnly: true}).status(200).json(rest);
        }else{
            const generatePassword= Math.random().toString(36).slice(-8) ;
            // this will generate a random password mix of 0-9 & a-z and we get the last 8 digits of it 
            // we generate this password becuz with google login we don't ask for a password so when the menual login will take place , 
            // there should be a password with that we can login 
            const hashPassword = bcryptjs.hashSync(generatePassword, 10);
            const newUser = new User({
                username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) ,
                email: req.body.email,
                password: hashPassword,
                avatar: req.body.photo
              });
            await newUser.save();
            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const { password: pass, ...rest} = newUser._doc;
            res.cookie("access_token", token ,{httpOnly: true}).status(200).json(rest);
        }
        
    } catch (error) {
        next(error);
    }
}