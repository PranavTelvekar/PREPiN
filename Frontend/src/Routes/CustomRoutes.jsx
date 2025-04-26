import { Routes, Route } from "react-router-dom";
import HomePage from '../components/HomePage/HomePage';
import Signup from "../components/Signup/Signup";
//import { Login } from "@mui/icons-material";

//student
import StudentInputProfile from "../components/Student/Profile/StudentInputProfile";
import StudentProfile from "../components/Student/Profile/StudentProfile";
import Home from "../components/Student/Home/Home";
import InterviewBook from '../components/Student/InterviewBook/InterviewBook';
import Explore from "../components/Student/Explore/Explore";
import MyInterview from '../components/Student/MyInterview/MyInterview';
import Result from "../components/Student/Result/Result";

//interviewer
import IHome from "../components/Interviewer/Home/IHome";
import StudentData from "../components/Interviewer/StudentData/StudentData";
import IMyInterview from "../components/Interviewer/MyInterview/IMyInterview";
import IResult from "../components/Interviewer/MyInterview/Result/IResult";
import EditIResult from "../components/Interviewer/MyInterview/Result/EditIResult";
import VideoMeetComponent from "../components/VideoMeet";
import InterviewerProfile from "../components/Interviewer/profile/InterviwerProfile";
import InterviewerInputProfile from "../components/Interviewer/profile/InterviewerInputProfile";
import InterviewerSignup from "../components/Signup/InterviewerSignup"
import Login from "../components/Login/Login"
import InterviewerLogin from "../components/Login/InterviewerLogin"

function CustomeRoutes() {
    return(
        <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/demo" element={ <StudentData /> } />
            {/* student */}
            <Route path="/student/sign-up" element={ <Signup /> } />
            <Route path="/student/login" element={ <Login /> } />
            <Route path="/student/:email/home/:department" element={ <Home /> } />
            <Route path="/student/:email/my-interview" element={ <MyInterview /> } />
            <Route path="/student/:email/my-interview/:iid/result" element={ <Result /> } />
            <Route path="/student/:email/home/:department/:id/book/:slot" element={ <InterviewBook /> } />
            <Route path="/student/:email/home/:department/:id/explore" element={ <Explore /> } />
            <Route path="/student/:email/home/:department/:id/explore/book/:slot" element={ <InterviewBook /> } />
            <Route path="/student/:email/edit-profile" element={ <StudentInputProfile /> } />
            <Route path="/student/:email/profile" element={ <StudentProfile /> } />
            
            



            {/* interviewer */}
            <Route path="/interviewer/sign-up" element={<InterviewerSignup/> } />
            <Route path="/interviewer/login" element={ <InterviewerLogin/> } />
            <Route path="/interviewer/:email/home" element={ <IHome /> } />
            <Route path="/interviewer/:email/home/:id" element={ <StudentData /> } />
            <Route path="/interviewer/:email/my-interview" element={ <IMyInterview /> } />
            <Route path="/interviewer/:email/my-interview/:id" element={ <StudentData /> } />
            <Route path="/interviewer/:email/my-interview/:id/result" element={ <IResult /> } />
            <Route path="/interviewer/:email/my-interview/:id/edit-result" element={ <EditIResult /> } />
            <Route path="/interviewer/:email/profile" element={<InterviewerProfile/>}/>
            <Route path="/interviewer/:email/edit-profile" element={<InterviewerInputProfile/>}/>

            {/*Video Call Component*/}

            <Route path="call/:iid" element={<VideoMeetComponent/>} />


        </Routes>
    );
}

export default CustomeRoutes;