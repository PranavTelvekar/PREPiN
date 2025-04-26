import mongoose from "mongoose";
const interviewSlotSchema=new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    slot:{type:mongoose.Schema.Types.ObjectId,ref:'Slot',required:true},
    status:{
        type:String,
        enum:["Completed","Pending",],
        default:"Pending"
    },
    analysedResult:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'InterviewResult'
    },
    paymentId:{
        type:String,
        default:"Complete"
    }
})

const InterviewModel=mongoose.model("InterviewModel",interviewSlotSchema)

export {InterviewModel};
