import mongoose from "mongoose";


const slotSchema = new mongoose.Schema({
    interviewerId: { type:mongoose.Schema.Types.ObjectId, ref: "Interviewer", require:true },
    start: {
        type: String,
        require: true
    },
    end: {
        type: String,
        require: true
    },
    isBooked:{
        type:Boolean,
        default:false
    }
})

const Slot=mongoose.model("Slot",slotSchema)
export {Slot};