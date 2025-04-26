import Card from './Card';
import './CardList.css';


function CardList({ department, data, handleBookClick }) {

    

    return (
        <div className='classlist' >
            <h2 className='classlist-h2' >{ department }</h2>
            <div className="cardlist-wrapper">
                {
                    data.map( (val, index) => {
                        return <Card key={index} department={department} handleBookClick={(id) => handleBookClick(id)}  interviewerName={val.name} tolalExperience={val.profileData.totalExperience} reviewScore={val.reviewScore} thumbnail={val.profileData.profileImage}  />
                    } )
                }
            </div>
        </div>
    );
}


export default CardList;