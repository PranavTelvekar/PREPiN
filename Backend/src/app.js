import 'dotenv/config';
import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);


app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));


import studentRoters from "./routes/studentRouters.js"
app.use("/student",studentRoters);

import interviewerRouters from "./routes/interviewersRouters.js"
import { InterviewModel } from "./models/InterviewModel/interviewModel.js";
import { Slot } from "./models/InterviewModel/slot.js";
import { User } from "./models/UserModels/userModel.js";
import { Interviewer } from "./models/InterviewerModel/interviewerModel.js";

app.use("/interviewer",interviewerRouters);


// console.log(process.env.MONGO_URL)

app.post('/api/payment/:useremail/:sid', async (req, res) => {
    //const { paymentId, amount, name, email, contact } = req.body;

    let {useremail,sid}=req.params;

    try {

        let slot=await Slot.findById(sid).populate("interviewerId");
        let user=await User.findOne({email:useremail});

        //console.log(user);

        //let interviewer=await Interviewer.findById(slot.interviewerId._id);

    
      let newInteview=new InterviewModel({
            userId:user._id,
            slot:slot._id,
      })

      newInteview.save();

      user.interview.push(newInteview._id);

      user.save();
      res.status(201).json({ message: "Payment info saved successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Failed to save payment info", error: err });
    }
  });


  app.use("/call/:iid",async(req,res)=>{
        let {iid}=req.params;


        let interview = await InterviewModel.findById(iid);

        console.log(interview);

        interview.status="Completed";
        interview.save();


        res.json({message :"Call Is Ended"});
  })




const start = async () => {
    main().catch(err => console.log(err));

    async function main() {
    await mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("Database Connected")});

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
    }
    server.listen(app.get("port"), () => {
        console.log("LISTENIN ON PORT 8000")
    });



}



start();