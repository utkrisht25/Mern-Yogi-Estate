import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';


import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
dotenv.config();

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("connected to database"); 
}).catch(err=> console.log(err)
)

const _dirname = path.resolve();


const app = express();
// var cors = require('cors')
app.use(cors())

app.use(express.json());
app.use(cookieParser());

app.listen(3000,()=>{
    console.log('Server is running on port 3000');   
});

app.use('/api/user', userRouter);
app.use('/api/auth',  authRouter);
app.use('/api/listing', listingRouter);

app.use(express.static(path.join(_dirname, '/client/dist')));

app.get('*', (req,res)=>{
    res.sendFile(path.join(_dirname, 'client' , 'dist', 'index.html'));
})

//this is the middleware we are using to avoid the repetition of the try catch block every time on eveery route to check the error
app.use((err, req, res, next) =>{
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success : false,
        statusCode,
        message,
    });
});