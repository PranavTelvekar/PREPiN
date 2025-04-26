import { useContext, useState } from 'react';
import './Navbar.css';
import defaultImage from '../../assets/default-profile-image.svg';
import DataState from '../../Hooks/DataState';

function HomeNavbar() {

    const [ optionDisplay, setOptionDisplay ] = useState(false);
    const { navigate } = useContext(DataState);

    const handleClick = () => {
        navigate('/sign-up');
    }
    

    return (
        <nav>
            <h2 className="logo">PREPiN</h2>
            <div className="profile" onClick={ () => setOptionDisplay(!optionDisplay) } >
                <label id='profile-image' htmlFor="profile">Profile</label>
                <img src={ defaultImage } id='profile'  alt="Profile Image" />
            </div>
            <div id="options" className={ optionDisplay?'show':'no-show' } >
                <div className='nav-btn' onClick={ handleClick } >Sign-in</div>
            </div>
        </nav>
    );
}


export default HomeNavbar;