import './IMyInterview.css';
import InterviewerNavbar from '../../Navbar/InterviewerNavbar';
import ICard from './ICard/ICard';
import { useNavigate, useParams } from 'react-router';
import CustomeRoutes from '../../../Routes/CustomRoutes';
import { useEffect, useState } from 'react';
import axios from 'axios';
import server from '../../../environment';
const client=axios.create({
    baseURL:`${server}/interviewer`
})


function IMyInterview() {

    const navigate = useNavigate(CustomeRoutes);
    const { email } = useParams();
    const [completedInterview,setCompletedInterview]=useState([])


    useEffect(()=>{
            let getCompletedInterviewHistory=async()=>{
    
                let getCompletedInterview=await client.get(`/${email}/completed`);
                console.log(getCompletedInterview.data)
                setCompletedInterview(getCompletedInterview.data.completedInterview)
    
            }
            getCompletedInterviewHistory()
    
        },[email])
    


    return (
        <div className="imy-interview-wrapper">
            <InterviewerNavbar />
            <div className="imy-interview">
                <h2>History</h2>
                <div className="imy-interview-card">
                {
                        completedInterview.map((data,index)=>{
                            return <ICard interviewID={data._id} name={data.userId.name} slot={data.slot.start} payment={0} id={data.userId._id} key={index} />
                        })
                }
                </div>
                <button className='my-interview-back-btn' onClick={ () => navigate(`/interviewer/${email}/home`) } >Back</button>
            </div>
        </div>
    );
}


export default IMyInterview;