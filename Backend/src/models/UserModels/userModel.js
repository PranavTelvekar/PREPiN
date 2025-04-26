import mongoose from "mongoose";

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true
        },
        profileData:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'ProfileData'
        },
        interview:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'InterviewModel'
            }
        ],
        reviews:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Review'
            }
        ],

    }
)


const User=mongoose.model("User",userSchema)
export{User};