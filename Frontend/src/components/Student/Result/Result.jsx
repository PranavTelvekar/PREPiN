import { useNavigate, useParams } from 'react-router';
import './Result.css';
import CustomeRoutes from '../../../Routes/CustomRoutes';
import axios from 'axios';
import { useState ,useEffect} from 'react';
import server from '../../../environment';
const client=axios.create({
    baseURL:`${server}/student`
})

function Result() {

    const navigate = useNavigate(CustomeRoutes);
    const { email ,iid} = useParams();
    const [pros,setPros]=useState([])
    const [cons,setCons]=useState([])
    const [resume,setResume]=useState("")
    const [review,setReview]=useState("")
    const [score,setScore]=useState(0)
    console.log(iid);
    useEffect(()=>{
            let getResult=async()=>{
                console.log("Hare Krishsna")
                let response=await client.get(`/${email}/${iid}/see-result`)
    
                console.log(response.data.result)
                setCons(response.data.result.cons)
                setPros(response.data.result.pros)
                setResume(response.data.result.resumeImprovement)
                setReview(response.data.result.review)
                setScore(response.data.result.score)
            }
            getResult()
        },[email])

        return (
            <div className="result-wrapper">
                <h1>Result</h1>
                <div className="score"><h1>{score}%</h1></div>
                <div className="pros">
                    <h2>Pros</h2>
                    {
                        pros.map((val,index)=>{
                            return <div key={index} className="pros-point">{val}</div>
                        })
                    }
                    
                </div>
                <div className="cons">
                    <h2>Cons</h2>
                    {
                        cons.map((val,index)=>{
                            return <div key={index} className="cons-point">{val}</div>
                        })
                    }
                </div>
                <div className="resume-details">
                    <h2>Resume Details</h2>
                    <div className="resume-details-point">{resume}</div>
                </div>
                <div className="overall-details">
                    <h2>Review</h2>
                    {review}
                </div>
                <button className='result-btn' onClick={ () => navigate(`/interviewer/${email}/my-interview`) } >Back</button>
            </div>
        );
}

export default Result;