import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

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