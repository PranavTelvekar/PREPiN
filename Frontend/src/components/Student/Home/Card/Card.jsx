import './Card.css';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';
import CustomeRoutes from '../../../../Routes/CustomRoutes';
import CardNameIcon from '../../../../assets/card-name.svg';
import CardDepartmentIcon from '../../../../assets/card-department.svg';
import CardExperienceIcon from '../../../../assets/card-experience.svg';

function Card({ department, interviewerName, experience, reviewScore, thumbnail, handleBookClick }) {

    const navigate = useNavigate(CustomeRoutes);

    
    return (
        <div className="card">
            <img id='thumbnail' src={thumbnail} alt="Thumbnail" />
            <div className="card-data">
                <p className='card-para' ><span><img src={ CardNameIcon } width={17} height={17} alt="Name" /></span><span>&nbsp;{ interviewerName }</span></p>
                <p className='card-para' ><span><img src={ CardDepartmentIcon } width={17} height={17} alt="Department" /></span><span>&nbsp;{ department }</span></p>
                <p className='card-para' ><span><img src={ CardExperienceIcon } width={17} height={17} alt="Experience" /></span><span>&nbsp;{ experience }</span></p>
                <Rating name="half-rating-read" defaultValue={reviewScore} precision={0.5} readOnly/>
                <div className="card-btn-wrapper">
                    <button id='explore' className='card-btn' onClick={ () => navigate(`${interviewerName}/explore`) } >Explore</button>
                    <button id='book' className='card-btn' onClick={ () => handleBookClick(interviewerName) }  >Book</button>
                </div>
            </div>
        </div>
    );
}



export default Card;