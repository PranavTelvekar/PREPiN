import { useNavigate } from 'react-router-dom';
import './ICard.css';
import CustomeRoutes from '../../../../Routes/CustomRoutes';
import { useState } from 'react';
import axios from 'axios';
import server from '../../../../environment';
const client=axios.create({
    baseURL:`${server}/interviewer`
})

function ICard({ interviewID,name, slot, payment, id }) {


    const navigate = useNavigate(CustomeRoutes);
    const [ isResult, setIsResult ] = useState(false);


    const handleExploreClick = () => {
        console.log("Explore Clicked");
        navigate(`${id}`);

    }

    const handleResultClick = () => {
        // fetch the data from database to cheak the result is given or not based on that set the flage of isResult

        let isResult=async()=>{
            let response=await client.get(`/${interviewID}/result`);
            if(response.data.interview.analysedResult) {
                navigate(`${interviewID}/result`);
            }
            else{
                navigate(`${interviewID}/edit-result`);
            }
        }

        isResult();

        
    }

    return (
        <div className="my-interview-icard">
            <div className="my-interview-icard-img-name">
                <img src="data:image/jpeg;base64,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" alt="Studnet Profile Image" />
                <h3>{name}</h3>
            </div>
            <div className="my-interview-icard-line"></div>
            <div className="my-interview-icard-data">
                <div className="my-interview-icard-slot"><span><svg width="15" height="15" viewBox="0 0 122.88 122.88" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><g><path fillRule="evenodd" clipRule="evenodd" d="M61.44,0c33.93,0,61.44,27.51,61.44,61.44c0,33.93-27.51,61.44-61.44,61.44C27.51,122.88,0,95.37,0,61.44C0,27.51,27.51,0,61.44,0L61.44,0z M52.92,30.52h7.51c1.37,0,2.5,1.13,2.5,2.5v28.94h26.41c1.38,0,2.5,1.13,2.5,2.5v7.51c0,1.38-1.13,2.5-2.5,2.5H50.41V33.02C50.41,31.64,51.54,30.52,52.92,30.52L52.92,30.52z M61.44,13.95c26.23,0,47.49,21.26,47.49,47.49c0,26.23-21.26,47.49-47.49,47.49c-26.23,0-47.49-21.26-47.49-47.49C13.95,35.22,35.21,13.95,61.44,13.95L61.44,13.95z"/></g></svg></span>
                    <span className='my-interview-data'>{slot}</span>
                </div>
                <div className="my-interview-icard-payment"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 512 512" shapeRendering="geometricPrecision" textRendering="geometricPrecision" imageRendering="optimizeQuality" fillRule="evenodd" clipRule="evenodd" fill="currentColor"><path d="M256 59.55c108.49 0 196.45 87.96 196.45 196.45S364.49 452.45 256 452.45 59.55 364.49 59.55 256 147.51 59.55 256 59.55zM256 0c70.68 0 134.69 28.66 181.01 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.69-74.99 181.01C390.69 483.34 326.69 512 256 512s-134.69-28.66-181.02-74.99C28.66 390.69 0 326.68 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm163.27 92.72C377.49 50.94 319.76 25.09 256 25.09c-63.77 0-121.5 25.85-163.28 67.63C50.94 134.5 25.09 192.23 25.09 256c0 63.76 25.85 121.49 67.63 163.27C134.5 461.06 192.23 486.9 256 486.9c63.77 0 121.5-25.84 163.27-67.63 41.79-41.77 67.63-99.5 67.63-163.27 0-63.77-25.84-121.5-67.63-163.28zM181.09 235.97l12.7-28.61h47.9c-3.02-10.16-14.89-15.87-24.84-15.87h-35.76l12.7-28.61h137.12l-12.7 28.61h-33.12c4.39 3.37 9.1 10.32 9.93 15.87h35.89l-12.7 28.61h-25.97c-8.38 21.34-33.95 35.83-55.75 38.97l72.05 74.18h-56.96l-64.25-70.49v-26.27h28.44c2.73 0 5.42-.44 8.06-1.35 6.93-2.34 14.42-7.81 16.74-15.04h-59.48z"/></svg>
                    <span className='my-interview-data'>{payment}</span>
                </div>
                <div className="my-interview-icard-result"><span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.65 122.88" width="17px" height="17px" fill="currentColor"><g><path d="M35.84,113.9c-0.06-1.56-0.29-3.12-0.66-4.65c-1.49-6.03-5.27-11.54-9.93-15.54c-0.18-0.16-0.36-0.31-0.55-0.46l-4.2,4.1c3.24,2.48,5.58,5.88,6.54,9.05c0.52,1.72,0.67,3.41,0.38,4.93c-0.33,1.74-1.19,3.23-2.66,4.31c-0.33,0.24-0.68,0.45-1.06,0.64c1.88,0.93,3.65,1.51,5.18,1.63c1.54,0.13,2.89-0.15,4.03-0.84C34,116.41,34.97,115.36,35.84,113.9z M78.92,71.24c-0.4-0.21-0.72-0.51-0.95-0.87l-0.79,0.78c0.29,0.19,0.54,0.44,0.73,0.74c4.08,6.44,6.43,12.99,6.65,19.67c0.22,6.71-1.71,13.45-6.19,20.25c-0.75,1.14-2.27,1.45-3.41,0.7s-1.45-2.27-0.7-3.41c3.89-5.9,5.57-11.69,5.38-17.39c-0.19-5.73-2.27-11.45-5.89-17.17l-6.27,6.18c-0.06-0.19-0.12-0.37-0.18-0.56l-0.48,0.47l-26.39,35.19c-1.35,2.47-3.01,4.28-4.97,5.46c-2.07,1.24-4.39,1.75-6.95,1.54c-3.91-0.32-8.86-2.76-13.5-6.31c-0.15-0.09-0.3-0.2-0.42-0.33c-1.6-1.25-3.15-2.62-4.61-4.08c-3.31-3.31-6.18-7.11-7.96-10.89c-1.92-4.07-2.61-8.18-1.35-11.83c0.81-2.34,2.39-4.42,4.91-6.08l36.99-28.15l20.01-21.39L86.1,1.36c0.4-0.55,0.98-0.88,1.6-0.99c3.44-0.66,6.94-0.41,10.34,0.53c5.84,1.61,11.37,5.27,15.68,9.88c4.32,4.62,7.46,10.24,8.53,15.74c0.58,2.98,0.55,5.94-0.22,8.72c-0.15,0.56-0.49,1.03-0.93,1.35l0,0.01L85.7,62.21l-1.42,1.39c0,0.19-0.01,0.38-0.02,0.57l-2.85,2.81c5.22,2.73,9.45,6.16,12.54,10.41c3.16,4.35,5.11,9.5,5.66,15.56c0.12,1.35-0.88,2.55-2.23,2.67c-1.35,0.12-2.55-0.88-2.67-2.23c-0.47-5.14-2.09-9.48-4.73-13.11C87.31,76.63,83.58,73.64,78.92,71.24z M20.57,90.39c-3.36-1.94-6.88-3.05-10.14-3.03c-0.83,0.01-1.65,0.09-2.45,0.26C6.59,88.6,5.73,89.75,5.29,91c-0.8,2.31-0.25,5.16,1.15,8.12c1.53,3.26,4.06,6.57,7,9.52c1.23,1.23,2.53,2.4,3.85,3.45c2.27,0.38,3.74,0.16,4.55-0.44c0.39-0.29,0.63-0.72,0.73-1.24c0.14-0.74,0.05-1.63-0.25-2.59c-0.88-2.91-3.42-6.1-6.89-7.89c-1.21-0.62-1.69-2.1-1.07-3.31c0.13-0.25,0.29-0.46,0.48-0.64L20.57,90.39z M65.02,75.5c-3.92-6.44-11.06-13.32-17.98-17.96l-0.96,1.03c-0.12,0.15-0.27,0.29-0.43,0.42l-31.3,23.82c3.9,0.74,7.88,2.55,11.52,5.14l0.09,0.07l0.01,0.01c0.84,0.6,1.66,1.25,2.46,1.93c5.39,4.62,9.77,11.03,11.51,18.1l0.03,0.12l22.92-30.56c0.09-0.14,0.2-0.27,0.33-0.39L65.02,75.5z M64.12,39.29c8.91,4.41,16.34,11.56,19.05,18.66l34.3-24.82c0.35-1.79,0.31-3.71-0.07-5.68c-0.89-4.58-3.58-9.34-7.29-13.31c-3.73-3.99-8.44-7.14-13.36-8.49c-2.4-0.66-4.84-0.89-7.25-0.57L66.49,36.74l-0.01-0.01c-0.06,0.08-0.12,0.16-0.2,0.24L64.12,39.29z"/></g></svg></span>
                    <span className='my-interview-data' >{ isResult?"Declared":"Pending" }</span>
                </div>
                <div className="my-interview-icard-btn-wrapper">
                    <button id='my-interview-explore' className='my-interview-icard-btn' onClick={handleExploreClick} >Explore</button>
                    <button id='my-interview-result' className='my-interview-icard-btn' onClick={handleResultClick} >Result</button>
                </div>
            </div>
        </div>
    );
}

export default ICard;