import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        unique : true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    }
}, {timestamps : true});

// this timestamp is give us 2 values (time when user/document first time created:- createdAt , updateAt:- updates every time the document is modified/saved )

const User = mongoose.model('User', userSchema);

export default User;