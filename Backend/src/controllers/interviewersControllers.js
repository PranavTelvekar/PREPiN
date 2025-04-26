import httpStatus from "http-status";
import { Interviewer } from "../models/InterviewerModel/interviewerModel.js";
import {InterviewerProfileData} from "../models/InterviewerModel/interviewerProfileModel.js"
import bcrypt from "bcrypt";
import crypto from "crypto";
import {Slot} from "../models/InterviewModel/slot.js";
import {InterviewModel} from "../models/InterviewModel/interviewModel.js";
import { InterviewResult } from "../models/InterviewModel/analyzedResult.js";
import { User } from "../models/UserModels/userModel.js";
import cloudinary from "../utils/cloudinary.js";

// Login functionality for the interviewer
const loginInterviewer = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Please provide both username and password." });
    }

    try {
        const interviewer = await Interviewer.findOne({ email });
        if (!interviewer) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found." });
        }

        let isPasswordCorrect = await bcrypt.compare(password, interviewer.password);

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            interviewer.token = token;
            await interviewer.save();
            return res.status(httpStatus.OK).json({ token: token });
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid username or password." });
        }
    } catch (e) {
        return res.status(500).json({ message: `Something went wrong: ${e.message}` });
    }
};

// Registration functionality for the interviewer
const registerInterviewer = async (req, res) => {
    const { email, password ,name} = req.body;

    console.log(req.body.formData);

    try {
        // Check if the user already exists
        const existingInterviewer = await Interviewer.findOne({ email });
        if (existingInterviewer) {
            return res.status(httpStatus.FOUND).json({ message: "User already exists." });
        }

        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new interviewer
        const newInterviewer = new Interviewer({
            email: email,
            password: hashedPassword,
            name:name,
        });

        // Save new user to the database
        await newInterviewer.save();

        res.status(httpStatus.CREATED).json({ message: "User registered successfully." });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: `Something went wrong: ${e.message}` });
    }
};






// Placeholder for homepage (incomplete function)




const createSlot=async(req,res)=>{
    try {
        let {id}=req.params;
        let {slot}=req.body;
        let [date,time]=slot.split('T');
        console.log(date , time) 
        let dateObj=new Date(slot)
        dateObj.setHours(dateObj.getHours()+2)
        const updatedSlot = dateObj.toISOString().slice(0, 16);
        const interviewer=await Interviewer.findOne({email:id});
        let newSlot=new Slot({
            start:slot,
            end:updatedSlot
        })
        newSlot.interviewerId=interviewer._id;
        newSlot.save()
        res.json({message:"Slot Is Created Successfully"})
    } catch (error) {
        console.log(error)
    }

}

const getReviews=async(req,res)=>{
    try {
        let {email}=req.params;
        let interviewer=await Interviewer.findOne({email:email}).populate({path:"reviews",populate:{path:"userId"}});
        res.json({reviews:interviewer.reviews})
    } catch (error) {
        
    }
}

const getUpcomingInterviews = async (req, res) => {
    try {
        console.log("request is here")
        const { email } = req.params;
        const interviewer = await Interviewer.findOne({ email });

        if (!interviewer) {
            return res.status(404).json({ message: 'Interviewer not found' });
        }

        const slots = await Slot.find({ interviewerId: interviewer._id });

        const upcomingInterviews = [];

        for (const slot of slots) {
            const interview = await InterviewModel.findOne({ slot: slot._id }).populate("slot").populate("userId");
            if (interview && interview.status === 'Pending') {
                upcomingInterviews.push(interview);
            }
        }



        res.status(200).json({ upcomingInterviews });

    } catch (error) {
        console.error('Error fetching upcoming interviews:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getCompletedInterview = async (req, res) => {
    try {
        const { email } = req.params;
        const interviewer = await Interviewer.findOne({ email });

        if (!interviewer) {
            return res.status(404).json({ message: 'Interviewer not found' });
        }

        const slots = await Slot.find({ interviewerId: interviewer._id });

        const completedInterview = [];

        for (const slot of slots) {
            const interview = await InterviewModel.findOne({ slot: slot._id }).populate("slot").populate("userId");
            if (interview && interview.status === 'Completed') {
                completedInterview.push(interview);
            }
        }



        res.status(200).json({ completedInterview });

    } catch (error) {
        console.error('Error fetching upcoming interviews:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};


const getResult=async(req,res)=>{
    console.log("Hare Krishna");

    let {iid}=req.params;

    console.log(iid)

    try {
        let interview=await InterviewModel.findById(iid);
        res.json({interview})
    } catch (error) {
        
    }
}


const submitResult=async(req,res)=>{
    //console.log(req.body);

    let {pros,cons,resumeData,reviewData,scoreData}=req.body;

    let {email,iid}=req.params;

    let interviewer=await Interviewer.findOne({email});

    let interview=await InterviewModel.findById(iid);

    let newResult=new InterviewResult({
        pros,
        cons,
        resumeImprovement:resumeData,
        review:reviewData,
        score:scoreData
    })

    newResult.interviewerId=interviewer._id;

    newResult.save();

    interview.analysedResult=newResult._id

    interview.save();

    res.json({message:"Result Submited Successfullly"});



}

const seeResult=async(req,res)=>{
    try {

        console.log("hare krishna")
        let {iid}=req.params;
        let interview=await InterviewModel.findById(iid).populate("analysedResult");

        console.log(interview)
        res.json({result:interview.analysedResult});
    } catch (error) {
        
    }
}

const getStudentProfile = async (req, res) => {
    try {

        console.log("profile data is requested");

        const { id } = req.params;

        // Find user and populate profile data
        const user = await User.findById(id)
            .populate({
                path: 'profileData',
                select: '-_id -__v -user' // Exclude unnecessary fields
            })
            .select('-password -_id -__v -reviews -interview'); // Exclude sensitive data


        console.log(user)

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


const getMyProfile = async (req, res) => {
    try {

        console.log("profile data is requested");

        const { email } = req.params;

        // Find user and populate profile data
        const user = await Interviewer.findOne({ email })
            .populate({
                path: 'profileData',
                select: '-_id -__v -user' // Exclude unnecessary fields
            })
            .select('-password -_id -__v -reviews -interview'); // Exclude sensitive data

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Interview not found"
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


const profileBuild = async (req, res) => {
    try {
        console.log("Profile build request received");

        if (!req.body.email) {
            return res.status(400).json({ 
                success: false,
                message: "Email is required" 
            });
        }

        // Parse form data
        const { email, name, bio, category, totalExperience } = req.body;
        const education = JSON.parse(req.body.education || '[]');
        const experience = JSON.parse(req.body.experience || '[]');

        // File handling - profile photo
        let photoUrl = null;
        if (req.files && req.files.photo) {
            try {
                const photoFile = Array.isArray(req.files.photo) ? req.files.photo[0] : req.files.photo;
                
                if (!photoFile.buffer) {
                    throw new Error('File buffer is missing');
                }

                const photoResult = await cloudinary.uploader.upload(
                    `data:${photoFile.mimetype};base64,${photoFile.buffer.toString('base64')}`,
                    {
                        folder: 'interviewer-photos',
                        resource_type: 'image',
                        quality: 'auto:good'
                    }
                );
                photoUrl = photoResult.secure_url;
            } catch (uploadError) {
                console.error('Photo upload failed:', uploadError);
                // Continue without photo rather than failing the entire request
            }
        }

        // Find interviewer
        const interviewer = await Interviewer.findOne({ email });
        if (!interviewer) {
            return res.status(404).json({ 
                success: false,
                message: "Interviewer not found" 
            });
        }

        // Prepare experience data
        const formattedExperience = experience.map(exp => ({
            title: exp.title,
            company: exp.cName,
            startDate: exp.jDate,
            endDate: exp.lDate,
            description: exp.description,
            experience: exp.years
        }));

        // Update or create profile
        let profile;
        if (interviewer.profileData) {
            profile = await InterviewerProfileData.findByIdAndUpdate(
                interviewer.profileData,
                {
                    profileImage: photoUrl || undefined, // Only update if photoUrl exists
                    Bio: bio,
                    Education: education,
                    experience: formattedExperience,
                    category,
                    totalExperience
                },
                { new: true }
            );
        } else {
            profile = new InterviewerProfileData({
                user: interviewer._id,
                profileImage: photoUrl,
                Bio: bio,
                Education: education,
                experience: formattedExperience,
                category,
                totalExperience
            });
            await profile.save();
            interviewer.profileData = profile._id;
            await interviewer.save();
        }

        res.json({
            success: true,
            message: "Profile updated successfully",
            data: {
                name,
                bio,
                category,
                totalExperience,
                education,
                experience: formattedExperience,
                photoUrl
            }
        });

    } catch (error) {
        console.error(`Error in profileBuild: ${error.message}`);
        console.error(error.stack);
        res.status(500).json({ 
            success: false,
            error: "Internal Server Error",
            message: error.message 
        });
    }
};
export { loginInterviewer, registerInterviewer,  profileBuild ,createSlot ,getReviews,getUpcomingInterviews,getCompletedInterview,getResult,submitResult,seeResult,getStudentProfile,getMyProfile};
