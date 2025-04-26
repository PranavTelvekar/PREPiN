import mongoose from "mongoose";

const personalInfoSchema=new mongoose.Schema(
    {
        user:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
        profileImage:{
            type:String,
        },
        Bio:{
            type:String
        },
        Education:[
            {
                degree:String,
                institution:String,
                yearOfCompletion:Date
            }
        ],
        experience:[
            {
                title:String,
                experience:Number,
                company:String,
                startDate:Date,
                endDate:Date,
                description:String
            }
        ],
        Skills:[String],
        projects:[
            {
                title:String,
                description:String,
                projectUrl:String
            }
        ],
        resumePDF:{
            type:String
        },
    }
)

const ProfileData=mongoose.model("ProfileData",personalInfoSchema)


export{ProfileData};