import {  useState } from 'react';
import './Navbar.css';
import DataState from '../../Hooks/DataState';
import defaultImage from '../../assets/default-profile-image.svg';
import { useNavigate, useParams } from 'react-router';
import CustomeRoutes from '../../Routes/CustomRoutes';

function Navbar() {

    const [ profilePhoto, setProfilePhoto ] = useState();
    const [ name, setname ] = useState();
    const { email } = useParams();
    const [ optionDisplay, setOptionDisplay ] = useState(false);

    const navigate = useNavigate(CustomeRoutes);

    return (
        <nav>
            <h2 className="logo" onClick={ () => navigate(`/interviewer/${email}/home`) } >PREPiN</h2>
            <div className="profile" onClick={ () => setOptionDisplay(!optionDisplay) } >
                <label id='profile-image' htmlFor="profile">{ name?name:"Profile" }</label>
                <img src={ profilePhoto?profilePhoto:defaultImage } id='profile'  alt="Profile Image" />
            </div>
            <div id="options" className={ optionDisplay?'show':'no-show' } >
                <div id="img-data">
                    <img src={ profilePhoto?profilePhoto:defaultImage } id='img'  alt="Profile Image" />
                    <div className="data">
                        <p id='user-name'>{ name?name:email }</p>
                        <p id='user-gmail' >{ email }</p>
                    </div>
                </div>
                <div className='nav-btn' onClick={ () => navigate(`/interviewer/${email}/my-interview`) } >My Interview</div>
                <div className='nav-btn' onClick={ () => navigate(`/interviewer/${email}/profile`) }>Profile</div>
                <div className='nav-btn' onClick={ () => navigate(`/interviewer/${email}/edit-profile`) }>Build Profile</div>
                <div className='nav-btn' >Sign-out</div>
            </div>
        </nav>
    );
}



export default Navbar;