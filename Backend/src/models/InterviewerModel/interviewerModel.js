import mongoose from "mongoose";


const interviewerSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            //required:true
        },
        password:{
            type:String,
            //required:true
        },
        name:{
            type:String
        },
        profileData: { type: mongoose.Schema.Types.ObjectId, ref: "InterviewerProfileData" },
        reviews:[ { type:mongoose.Schema.Types.ObjectId, ref:'Review' } ] ,
        //slot:[{type:mongoose.Schema.Types.ObjectId,ref:"Slot"}]
    }
)

const Interviewer=mongoose.model("Interviewer",interviewerSchema)

export {Interviewer};