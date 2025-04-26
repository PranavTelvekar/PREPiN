import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import './Home.css';
import Navbar from '../../Navbar/Navbar';
import DataState from '../../../Hooks/DataState';
import SelectBtnList from './SelectBtn/SelectBtnList';
import CardList from './Card/CardList';
import Popup from './Popup/Popup';
import axios from "axios"
import server from '../../../environment';

const client = axios.create({
    baseURL: `${server}/student`
  });


function Home() {

    const { email } = useParams();
    const [ profilePhoto, setProfilePhoto ] = useState(null);
    const [ name, setName ] = useState(null);
    const [ displayPopup, setDisplayPopup ] = useState(false);
    const [ popupID, setPopupID ] = useState("");
    const [data, setData] = useState([]);

    function handleBookClick(id) {
        setDisplayPopup(true);
        setPopupID(id);
    }
    

    useEffect( () => {
        setName("Vinayak Sanjay Jadhav");
        setProfilePhoto("data:image/jpeg;base64,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");
        //setPopupID("4634634634")
    } , [email, profilePhoto, name] )

    const { department } = useParams();

    useEffect(() => {
            const fetchData = async () => {
              try {
                const response = await client.get(`/${email}/home/${department}`);
                //console.log(response.data.interviewers);
                setData(response.data.interviewers);
              } catch (error) {
                console.error("Error fetching data:", error);
              }
            };
        
            if (email && department) {
              fetchData();
            }
    }, [email, department]);

    return (
        <DataState.Provider value={ 
            { 
              profilePhoto, setProfilePhoto,
              name, setName
            }
           } >
            <div className="home-wrapper">
                <div className={displayPopup?"book-popup":"no-display"}>
                    <Popup id={popupID} setDisplayPopup={setDisplayPopup} />
                </div>
                <Navbar />
                <div className="home">
                    <div className="select-btn-list">
                        <SelectBtnList />
                    </div>
                    <div className="card-list-wrapper">
                        <CardList department={department} handleBookClick={(id) => handleBookClick(id)} data={data} />
                    </div>
                </div>
            </div>
          </DataState.Provider>
    );
}


export default Home;