import './Card.css';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';
import CustomeRoutes from '../../../../Routes/CustomRoutes';
import CardDepartmentIcon from '../../../../assets/card-department.svg';
import CardExperienceIcon from '../../../../assets/card-experience.svg';

function Card({iid, id, department, interviewerName, experience, reviewScore, thumbnail, handleReviewClick }) {

    const navigate = useNavigate(CustomeRoutes);


    function handleResultClick() {
        //console.log(iid)
        navigate(`${iid}/result`);
    }

    return (
        <div className="my-interview-card">
            <div className="my-interview-img-name">
                <img id='my-interview-thumbnail' src={thumbnail} alt="Thumbnail" />
                <h2 className='my-interview-card-para' >{ interviewerName }</h2>
            </div>
            <div className="my-interview-card-data">
                <p className='my-interview-card-para1' ><span><img src={ CardDepartmentIcon } width={17} height={17} alt="Department" /></span><span>&nbsp;{ department }</span></p>
                 <p className='my-interview-card-para1' ><span><img src={ CardExperienceIcon } width={17} height={17} alt="Experience" /></span><span>&nbsp;{ experience }</span></p> 
                <Rating name="half-rating-read" size='large' value={Math.random()*5} precision={0.1} readOnly/>
                <div className="my-interview-card-btn-wrapper">
                    <button id='my-interview-review' className='my-interview-card-btn' onClick={ () => handleReviewClick(id) }>Review</button>
                    <button onClick={()=>navigate(`/call/${iid}`)}>Join Call</button>
                    <button id='my-interview-result' className='my-interview-card-btn' onClick={ () => handleResultClick(iid) }  >Result</button>
                </div>
            </div>
        </div>
    );
}


export default Card;