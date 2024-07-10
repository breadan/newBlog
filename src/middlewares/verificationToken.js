import mongoose from "mongoose";

//verification Token Schema
const verifyTokenSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    }
}, {timestamps: true})


export {verifyTokenSchema}