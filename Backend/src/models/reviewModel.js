import mongoose from "mongoose";
const reviewSchema=new mongoose.Schema({

    userId:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    interviewerId:{type:mongoose.Schema.Types.ObjectId,ref:"Interviewer"},
    rating:{
        type:Number,
        min:1,max:5
    },
    comment:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    }

})

const Review=mongoose.model("Review",reviewSchema)
export{Review};