import { useState } from 'react';
import './Popup.css';
import Rating from '@mui/material/Rating';
import axios from "axios"
import { useParams } from 'react-router';
import server from '../../../../environment';
const client=axios.create({
    baseURL:`${server}/student`
})

function Popup({ id, displayPopup, setPopupDisplay }) {

    const [ rating, setRating ] = useState(2.5);
    const [ reviewData, setReviewData ] = useState("");
    const { email } = useParams();

    const handleSubmitClick = async() => {
        setPopupDisplay(false);
        console.log("ID: " + id + "\nRating: " + rating + "\nReview: " + reviewData);
        // send the data to backend

        let response=await client.post(`/${email}/${id}/review`,{rating:rating,comment:reviewData});

        


        

        setRating(2.5);
        setReviewData("");
    }

    const handleCancelClick = () => {
        setPopupDisplay(false);
        setRating(2.5);
        setReviewData("");
    }

    

    return (
        <div className={ displayPopup?"myinterview-popup":"no-display" }>
            <div className='myinterview-cancel-wrapper' onClick={handleCancelClick} >
                <span className='myinterview-cancel' >
                    <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15px" height="15px" viewBox="0 0 122.878 122.88" xmlSpace="preserve"><g><path d="M1.426,8.313c-1.901-1.901-1.901-4.984,0-6.886c1.901-1.902,4.984-1.902,6.886,0l53.127,53.127 l53.127-53.127c1.901-1.902,4.984-1.902,6.887,0c1.901,1.901,1.901,4.985,0,6.886L68.324,61.439l53.128,53.128 c1.901,1.901,1.901,4.984,0,6.886c-1.902,1.902-4.985,1.902-6.887,0L61.438,68.326L8.312,121.453 c-1.901,1.902-4.984,1.902-6.886,0c-1.901-1.901-1.901-4.984,0-6.886l53.127-53.128L1.426,8.313z"/></g></svg>
                </span>
            </div>
            <div className="myinterview-rating">
                <h2>Rating</h2>
                <Rating name="half-rating" value={rating} onChange={ (event) => setRating(event.target.value) }  size='large' defaultValue={2.5} precision={0.5} />
            </div>
            <div className="myinterview-review">
                <h3>Your Review</h3>
                <textarea id="review" value={reviewData} onChange={ (event) => setReviewData(event.target.value)  } ></textarea>
                <button id="review-btn" onClick={handleSubmitClick} >Submit</button>
            </div>
            
        </div>
    );
}

export default Popup;