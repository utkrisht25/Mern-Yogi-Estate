import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';

export const test = (req,res) =>{
    res.json({
        message : "Api route is working!",
    });
};

export const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, 'You can only update your own profile'));
    }
    try {
        if(req.body.password){
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    username: req.body.username,
                    email: req.body.email,
                    password: req.body.password,
                    avatar: req.body.avatar,
                }
            },
            { new: true}
        );
        // new: true will return the updated user
        // $set is see the fields that we want to update and the other fields will ignored and reain unchanged
        const { password , ...rest} = updatedUser._doc;
        // we are using _doc to get the document without the mongoose properties
        res.status(200).json(rest);
    } catch (error) {
         next(error);
    }
};

export const deleteUser = async (req,res,next) =>{
    if(req.user.id !== req.params.id){
        return next(errorHandler(401, 'You can only delete your own profile'));
    }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('access_token');
        res.status(200).json("User deleted successfully!");
        
    } catch (error) {
        next(error);
    }
};

export const getUserListings = async (req, res, next) =>{
    if(req.user.id === req.params.id){
        try {
            const listings = await Listing.find({userRef : req.params.id});
            res.status(200).json(listings);
        } catch (error) {
            next(error);
        }
    }else{
        return next(errorHandler(401, 'You can only view your own listings!!'));
    }
}
export const getUser = async (req, res, next) =>{
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return next(errorHandler(404, 'User not found!!'))
        }
        const {password: pass , ...rest} = user._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
}