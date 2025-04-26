import ICard from './ICard/ICard';
import './IHome.css';
import InterviewerNavbar from '../../Navbar/InterviewerNavbar';
import { useActionState, useEffect, useState } from 'react';
import LeftArrow from '../../../assets/angle-circle-arrow-left-icon.png';
import RightArrow from '../../../assets/angle-circle-arrow-right-icon.png';
import Review from './Review/Review';
import axios from 'axios';
import { useParams } from 'react-router';
import server from '../../../environment';
const client=axios.create({
    baseURL:`${server}/interviewer`
})

function IHome() {

    const [ reviews, setReviews ] = useState([]);
    const [ reviewPosition, setReviewPosition ] = useState(0);
    const [ reviewCount, setReviewCount ] = useState(0);
    const [ reviewBtnClick, setReviewBtnClick ] = useState(0);
    const [slot,setSlot]=useState('');
    const [upcomingInterviews,setUpcomingInterviews]=useState([])

    const {email}=useParams()

    function handleReviewLeftMove() {

        if(reviewBtnClick == 0) return;

        setReviewPosition((reviewPosition) => {
            let position = reviewPosition + 200;
            const element = document.getElementById("ihome-review-display");
            element.style.transition = 'transform 0.5s ease-in-out';
            element.style.transform = `translateX(${ position }px)`;
            setReviewBtnClick(reviewBtnClick - 1);
            return position;
        })
        
    }

    function handleReviewRightMove() {

        if(reviewBtnClick >= reviewCount) return;

        setReviewPosition((reviewPosition) => {
            let position = reviewPosition - 200;
            const element = document.getElementById("ihome-review-display");
            element.style.transition = 'transform 0.5s ease-in-out';
            element.style.transform = `translateX(${ position }px)`;
            setReviewBtnClick(reviewBtnClick + 1);
            return position;
        });
    }

    function handleAddSlot(){
        let addSlot=async()=>{
            let response=await client.post(`/${email}/slot`,{slot})
            //console.log(response);
            setSlot('');
        }
        addSlot()
    }


    useEffect(()=>{
        let getReviews=async()=>{
            let response=await client.get(`/${email}/reviews`);
            setReviews(response.data.reviews);
            //console.log(response.data)
            setReviewCount(response.data.reviews.length)

            let getUpcomingInterviews=await client.get(`/${email}/upcoming`);
            setUpcomingInterviews(getUpcomingInterviews.data.upcomingInterviews)

        }
        getReviews()

    },[email])



    return (
        <div className="ihome-wrapper">
            <InterviewerNavbar />
            <div className="ihome-add-slot"></div>
            <div className="ihome-upcoming-interview-wrapper">
                <div className="ihome-icard">
                    <h2>Upcoming Interview</h2>
                    <div className="icards">
                    {
                        upcomingInterviews.map((data,index)=>{
                            console.log(data);
                            return <ICard  iid={data._id} name={data.userId.name} slot={data.slot.start} payment={0} id={data.userId._id} key={index} />
                        })
                    }
                    
                    </div>
                </div>
                <div className="ihome-slot">
                    <h2>Add Slot</h2>
                    <div className="inputs">
                        <input type="datetime-local" name="slot" id="input-slot" onChange={(e)=>setSlot(e.target.value)} />
                        <button className='slot-add-btn' onClick={handleAddSlot} >ADD</button>
                    </div>
                </div>
                <div className="ihome-review">
                    <div className="line"></div>
                    <h2>Reviews</h2>
                    <div id='ihome-review-display' className="ihome-inner1">
                        {reviews.map((review,index)=>{
                            //console.log("userId:",review.userId,"rating:",review.rating,"comment:",review.comment)
                            return <Review review={review} key={index} />
                        })}
                    </div>
                    <div className="ihome-move-btns">
                        <button className='ihome-review-move-left move-btn' onClick={ () => handleReviewLeftMove() }  ><img src={ LeftArrow } width={35} height={35} alt="left-arrow" /></button>
                        <button className='ihome-review-move-right move-btn' onClick={ () => handleReviewRightMove() } ><img src={ RightArrow } width={35} height={35} alt="right-arrow" /></button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default IHome;