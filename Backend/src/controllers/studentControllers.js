import httpStatus from "http-status";
import { User } from "../models/UserModels/userModel.js";
import bcrypt, { hash } from "bcrypt"

import crypto from "crypto"

import {Interviewer} from "../models/InterviewerModel/interviewerModel.js"
import {Review} from "../models/reviewModel.js"
import {Slot} from "../models/InterviewModel/slot.js"
import { json } from "stream/consumers";
import {InterviewModel} from "../models/InterviewModel/interviewModel.js"
import { ProfileData } from "../models/UserModels/personalInformation.js";
import cloudinary from "../utils/cloudinary.js";
// import { Meeting } from "../models/meetings.model.js";
const login = async (req, res) => {

    console.log(req.body)

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please Provide" })
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" })
        }


        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }

    } catch (e) {
        return res.status(500).json({ message: `Something went wrong ${e}` })
    }
}


const register = async (req, res) => {


    //console.log("RamKrishsnaHari")
    const { name, email, password } = req.body;


    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered" })

    } catch (e) {
        console.log(e)
        res.json({ message: `Something went wrong ${e}` })
    }

}


// const getUserHistory = async (req, res) => {
//     const { token } = req.query;

//     try {
//         const user = await User.findOne({ token: token });
//         const meetings = await Meeting.find({ user_id: user.username })
//         console.log("Completed")
//         res.json(meetings)
//     } catch (e) {
//         console.log(e)
//         res.json({ message: `Something went wrong ${e}` })
//     }
// }

// const addToHistory = async (req, res) => {
//     const { token, meeting_code } = req.body;

//     try {
//         const user = await User.findOne({ token: token });

//         const newMeeting = new Meeting({
//             user_id: user.username,
//             meetingCode: meeting_code
//         })

//         await newMeeting.save();

//         res.status(httpStatus.CREATED).json({ message: "Added code to history" })
//     } catch (e) {
//         res.json({ message: `Something went wrong ${e}` })
//     }
// }


const getHomePage = async (req, res) => {

    //console.log("Request Is Arrived")

    let {department}=req.params;

    //console.log(department);

    const interviewers=await Interviewer.find({}).populate("profileData")

    //console.log(interviewers);

    let filteredInterviewers=[];

    interviewers.map((val, index) => {
        if (val.profileData && val.profileData.category && (val.profileData.category == department)) {
            filteredInterviewers.push(val);
        }
    });

   
    res.json({ interviewers:filteredInterviewers });
};

const getInterviewer=async(req,res)=>{
    let {id}=req.params;
    const interviewer=await Interviewer.findOne({name:id}).populate("profileData").populate({path:"reviews",populate:{path:"userId"}})
    //const reviews=await Review.find({interviewerId:id})

    //console.log(interviewer.reviews)

    const interviewerSlot=await Slot.find({interviewerId:interviewer._id})
    res.json({interviewer:interviewer,slot:interviewerSlot})
}

const giveRiview=async(req,res)=>{
    try {

        //console.log("request is arrived");
        let {email,id}=req.params;
        let {rating,comment}=req.body;
        //console.log(rating,email,id,comment)
        let user=await User.findOne({email:email})
        let interviewer =await Interviewer.findById(id);

        if(!user||!interviewer){
            return res,json({message:"User Or Interviewer Is Not Found"})
        }
        
        let newReview=new Review(
            {
                rating,
                comment,
                userId:user._id,
                interviewerId:interviewer._id
            }
        )

        await newReview.save();

        interviewer.reviews.push(newReview._id);
        user.reviews.push(newReview._id);
        await interviewer.save();
        await user.save();

        res.json({message:"Review Is Created Succesfully"});

    } catch (error) {
        res.json({message:error});
    }
}

const deleteReview = async (req, res) => {
    try {
        const { email, id, rid } = req.params;

        const user = await User.findOne({ email });
        const interviewer = await Interviewer.findById(id);

        if (!user || !interviewer) {
            return res.status(404).json({ message: "User or Interviewer not found" });
        }

        // Remove review ID from both user and interviewer
        user.reviews.pull(rid);
        interviewer.reviews.pull(rid);

        await user.save();
        await interviewer.save();

        const deletedReview = await Review.findByIdAndDelete(rid);

        if (!deletedReview) {
            return res.status(404).json({ message: "Review not found" });
        }

        res.status(200).json({ message: "Review deleted successfully" });

    } catch (error) {
        console.error("Error in deleteReview:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};



const getSlots=async(req,res)=>{
    try {

        //console.log(" slot request is here");
        let {id}=req.params;

        //console.log(id)
        let interviewer=await Interviewer.findOne({name:id});
        let slots=await Slot.find({interviewerId:interviewer._id});
        if(!slots){
            return res.json({message:"No Slots Available"});
        }
        res.json({slots:slots});
    } catch (error) {
        res.json({message:error});
    }
    
}

const bookSlot=async(req,res)=>{
    try {
        let {email,id,sid}=req.params;

        let user=await User.findOne({email});
        //let interviewer=await Interviewer.findById(id);
        let slot=await Slot.findById(sid)
        if(!user){
            return res.json({message:""})
        }

        if(!slot||slot.isBooked){
            return res.json({message:"Slot Is Already Booked"});
        }

        slot.isBooked=true;

        let newInterView= new InterviewModel(
            {
                userId:user._id,
                slot:slot._id
            }
        )

        await newInterView.save();
        await slot.save();

        res.json({message:"Slot Is Booked Successfully"})
    } catch (error) {
        res.json({message:error})
    }

}


const getMyInterviews=async(req,res)=>{
    try {
        let {email}=req.params;

        //console.log(email)

        let user=await User.findOne({email}).populate("interview");

        //console.log(user)
        if(!user){
            return res.json({message:"User Is Not Found"});
        }
        let myInterviews = await InterviewModel.find({ userId: user._id })
            .populate({
                path: "slot",
                populate: {
                    path: "interviewerId",
                    populate: {
                        path: "profileData"
                    }
                }
            });


    myInterviews.map((val,index)=>{
        //console.log(val);
    })



        //console.log(myInterviews)
        res.json({myInterviews:myInterviews});
    } catch (error) {
        res.json({message:error});
    }
}



const getResult=async(req,res)=>{
    let {email,iid}=req.params;

    //console.log("email : ",email,"iid : ",iid);


    let user = await User.findOne({email}).populate("interview");

    let interview=await InterviewModel.findById(iid).populate("analysedResult");


    res.json({result:interview.analysedResult});

}

const editProfile = async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.email) {
            return res.status(400).json({ 
                success: false,
                message: "Email is required" 
            });
        }

        // Parse form data
        const { email, name, bio, department } = req.body;
        const skills = JSON.parse(req.body.skills || '[]');
        const education = JSON.parse(req.body.education || '[]');
        const experience = JSON.parse(req.body.experience || '[]');
        const projects = JSON.parse(req.body.projects || '[]');

        // File handling - use buffers instead of paths
        let photoUrl = null;
        if (req.files?.photo) {
            const photoResult = await cloudinary.uploader.upload(
                `data:${req.files.photo[0].mimetype};base64,${req.files.photo[0].buffer.toString('base64')}`,
                {
                    folder: 'profile-photos',
                    resource_type: 'image',
                    quality: 'auto:good'
                }
            );
            photoUrl = photoResult.secure_url;
        }

        let resumeUrl = null;
        if (req.files?.resume) {
            const resumeResult = await cloudinary.uploader.upload(
                `data:${req.files.resume[0].mimetype};base64,${req.files.resume[0].buffer.toString('base64')}`,
                {
                    folder: 'resumes',
                    resource_type: 'image',
                    //format: 'pdf',
                    quality:'auto:good'
                }
            );
            resumeUrl = resumeResult.secure_url;
        }

        // Find and update user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: "User not found" 
            });
        }

        // Update or create profile
        let profile;
        if (user.profileData) {
            profile = await ProfileData.findByIdAndUpdate(
                user.profileData,
                {
                    profileImage: photoUrl || undefined, // Only update if new photo
                    Bio: bio,
                    Education: education,
                    experience: experience,
                    Skills: skills,
                    projects: projects,
                    resumePDF: resumeUrl || undefined // Only update if new resume
                },
                { new: true }
            );
        } else {
            profile = new ProfileData({
                user: user._id,
                profileImage: photoUrl,
                Bio: bio,
                Education: education,
                experience: experience,
                Skills: skills,
                projects: projects,
                resumePDF: resumeUrl
            });
            await profile.save();
            user.profileData = profile._id;
            await user.save();
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                name,
                bio,
                department,
                skills,
                education,
                experience,
                projects,
                photoUrl,
                resumeUrl
            }
        });

    } catch (error) {
        console.error("Error in editProfile:", error);
        res.status(500).json({ 
            success: false,
            message: "Failed to update profile",
            error: error.message 
        });
    }
};


const getStudentProfile = async (req, res) => {
    try {

        console.log("profile data is requested");

        const { email } = req.params;

        // Find user and populate profile data
        const user = await User.findOne({ email })
            .populate({
                path: 'profileData',
                select: '-_id -__v -user' // Exclude unnecessary fields
            })
            .select('-password -_id -__v -reviews -interview'); // Exclude sensitive data

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        if (!user.profileData) {
            return res.status(404).json({
                success: false,
                message: "Profile not completed yet"
            });
        }

        // Combine user and profile data
        const profile = {
            name: user.name,
            email: user.email,
            ...user.profileData._doc
        };

        res.status(200).json({
            success: true,
            profile
        });

    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export { register,getHomePage,getInterviewer ,giveRiview,deleteReview,getSlots,bookSlot,getMyInterviews,getResult,editProfile,getStudentProfile,login}