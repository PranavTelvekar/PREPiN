import mongoose from "mongoose";
const analyzedResultSchema=new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        interviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "Interviewer" },
        qualities: [{
            type: String,
            require: true,
        }],
        improvements: [{
            type: String,
            require: true
        }],
        resumeImprovement: {
            type: String,
            require: true
        },
        score: {
            type: Number,
            require: true
        }

    }
)