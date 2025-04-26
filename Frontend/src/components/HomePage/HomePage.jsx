import HomeNavbar from "../Navbar/HomeNavbar";
import './CSS/HomePage.css';
import Content from './Content';


function HomePage() {
    return (
        <div className="home-page">
            <HomeNavbar />
            <Content />
        </div>
    );
}


export default HomePage;