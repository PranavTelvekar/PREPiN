import './CSS/Content.css';
import HomeImage from '../../assets/home-image.jpg';
// import CustomeRoutes from '../../Routes/CustomRoutes';
// import { useContext, useState } from 'react';
import DataState from '../../Hooks/DataState';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function Content() {

    // const { navigate } = useContext(DataState);
    const [ disp, setDisp ] = useState(false);



    return (
        <div id='content-wrapper' >
            <div id="content">
                <div className="home-data">

                    <h1>Ace Your Next Interview with Confidence!</h1>
                    <p>


                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        Welcome to PREPiN, your personalized mock interview companion.
                        Practice real-world interview scenarios with experienced professionals.
                        Get actionable feedback, build confidence, and improve your skills.
                        Whether you're preparing for your first job, a career switch, or a top tech
                        company — we're here to help you succeed.
                        Schedule a mock interview today and take the first step toward your dream job!


                        <p id='signup' onClick={ () => setDisp(!disp) } >Get Started&gt;&gt;</p>
                        <div id={ disp?'choice1':'choice' }>
                            <Link className='disp-btn' to="/student/sign-up" >Student</Link>
                            <Link className='disp-btn' to="/interviewer/sign-up" >Interviewer</Link>
                        </div>

                    </p>
                </div>
                <img src={ HomeImage } alt="" className="home-img" />
            </div>
            <div className="footer">
                <div className="footer-buttons">
                    <button className='footer-btn' >About Us</button>
                    <button className='footer-btn' >Contact Us</button>
                    <button className='footer-btn' >FAQs</button>
                    <button className='footer-btn' >Privacy Policy</button>
                </div>
                <p className="footer-copy">© 2025 PREPiN. All rights reserved.</p>
            </div>
        </div>
    );
}

export default Content;