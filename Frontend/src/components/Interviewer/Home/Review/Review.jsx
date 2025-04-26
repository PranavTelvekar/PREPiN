import './Review.css';
import Rating from '@mui/material/Rating';

function Review({ review }) {

    // const { name, data, email, rating } = review;

    return (
        <div className="review">
            <div className="review-email-name">
                <h2 className='review-name'>{review.userId.name}</h2>
                <p className='review-email' >{review.userId.email}</p>
            </div>
            <div className="line"></div>
            <p className='review-data' >
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{review.comment}
            </p>
            <div className="review-score">
                <Rating name="half-rating-read" defaultValue={review.rating} precision={0.5} readOnly />
            </div>
        </div>
    );
}


export default Review;