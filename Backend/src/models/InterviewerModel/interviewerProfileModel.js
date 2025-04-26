import mongoose from "mongoose";

const interviewerProfileSchema = mongoose.Schema( {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "interviewerModel" },
    profileImage:{
        type:String
    },

    Bio:{
        type:String
    },
    experience:[
        {
            title:{type:String},
            experience:{type:Number},
            company:{type:String},
            startDate:{type:Date},
            endDate:{type:Date},
            description:{type:String}
        }
    ],
    totalExperience:{
        type:String
    },
    category:{
        type:String,
        enum:["IT","Mechanical","Civil","Computer Science"]
    }
    ,
    Education:[
        {
            degree:{type:String},
            institution:{type:String},
            yearOfCompletion:{type:Number}
        }
    ],
} )

const InterviewerProfileData=mongoose.model("InterviewerProfileData",interviewerProfileSchema)

export{InterviewerProfileData};