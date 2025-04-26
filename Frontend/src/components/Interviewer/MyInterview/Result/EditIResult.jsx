import './EditIResult.css';
import InterviewerNavbar from '../../../Navbar/InterviewerNavbar';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import CustomeRoutes from '../../../../Routes/CustomRoutes';
import { useEffect } from 'react';

import axios from 'axios';
import server from '../../../../environment';
const client=axios.create({
    baseURL:`${server}/interviewer`
})
function EditIResult() {

    const navigate = useNavigate(CustomeRoutes);
    const { email } = useParams();

    const [ pros, setPros ] = useState([]);
    const [ cons, setCons ] = useState([]);
    const [ p, setP ] = useState("");
    const [ c, setC ] = useState("");

    const {id} = useParams()

    console.log(id)

    const handleProsAdd = () => {
        if(p == "" ){
            alert("Don't Save Empty Data");
        }
        else {
            setPros([...pros, p]);
            setP("");
        }
        
    }

    const handleConsAdd = () => {
        if(c == "" ){
            alert("Don't Save Empty Data");
        }
        else {
            setCons([...cons, c]);
            setC("");
        }
        
    }

    const handleResultSubmit = () => {
        const resumeData = document.getElementById("resume-details-data").value;
        const reviewData = document.getElementById("result-review-data").value;
        const scoreData = document.getElementById("result-score-data").value;
        if(pros.length == 0 || cons.length == 0 || resumeData == "" || reviewData == "" || scoreData == "" ){
            alert("Every Field Must Be Filled");
        }
        else{
            navigate(`/interviewer/${email}/my-interview`);
        }
        
        //console.log("pros : ",pros,"cons : ",cons,"resumeData : ",resumeData,"reviewData : ",reviewData,"scoreData : ",scoreData)

        let submitResult=async()=>{
            let response = await client.post(`/${email}/${id}/submit-result`,{pros,cons,resumeData,reviewData,scoreData});
            console.log(response.data)
        }
        submitResult();


    }

    return (
        <div className="edit-result-wrapper">
            <InterviewerNavbar />
            <div className="edit-result">
                <h2>Submit Result</h2>
                <div className="edit-result-data">
                    <div className="edit-result-pros">
                        <h2>Pros</h2>
                        <input type="text" id='pros-data' value={p} onChange={ (event) => setP(event.target.value) } />
                        <button className='pros-data-add' onClick={handleProsAdd} >ADD</button>
                        <div className="pros-display">
                            {
                                pros.map( (val) => {
                                    return <p>{val}</p>
                                } )
                            }
                        </div>
                    </div>
                    <div className="edit-result-cons">
                        <h2>Cons</h2>
                        <input type="text" id='cons-data' value={c} onChange={ (event) => setC(event.target.value) } />
                        <button className='cons-data-add' onClick={handleConsAdd} >ADD</button>
                        <div className="cons-display">
                            {
                                cons.map( (val) => {
                                    return <p>{val}</p>
                                } )
                            }
                        </div>
                    </div>
                    <div className="edit-result-resume-details">
                        <h2>Resume Insights</h2>
                        <textarea id="resume-details-data"></textarea>
                    </div>
                    <div className="edit-result-review">
                        <h2>Review</h2>
                        <textarea id="result-review-data"></textarea>
                    </div>
                    <div className="edit-result-score">
                        <h2>Score</h2>
                        <input type="number" id="result-score-data" />
                    </div>
                </div>
                <button className="result-submit" onClick={handleResultSubmit} >Submit</button>
                <button className="result-back" onClick={ () => navigate(`/interviewer/${email}/my-interview`) } >Back</button>
            </div>
        </div>
    );
}


export default EditIResult;