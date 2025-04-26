import mongoose from "mongoose";
const analyzedResultSchema=new mongoose.Schema(
    {
        interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Interviewer" },
        pros: [{
            type: String,
            require: true,
        }],
        cons: [{
            type: String,
            require: true
        }],
        resumeImprovement: {
            type: String,
            require: true
        },
        review:{
            type:String,
            required:true
        },
        score: {
            type: Number,
            require: true
        }

    }
)

const InterviewResult=mongoose.model("InterviewResult",analyzedResultSchema)

export {InterviewResult};