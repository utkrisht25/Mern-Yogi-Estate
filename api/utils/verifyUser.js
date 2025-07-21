import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) =>{
    const token = req.cookies.access_token;

    if(!token) return (next(errorHandler(401 , 'unauthorized')));

    jwt.verify(token , process.env.JWT_SECRET, (err, user) =>{
        if(err) return next(errorHandler(403, 'forbidden'));

        req.user = user;
        next();
        // this next will take the request to the next middleware or route handler
        // so here we first verify the user by token and then take him to the updateuser route so only the verified user can update his own profile
    });
};