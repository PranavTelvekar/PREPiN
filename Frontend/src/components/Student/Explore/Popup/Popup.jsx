import { useEffect, useState } from 'react';
import './Popup.css';
import { useNavigate } from 'react-router';
import CustomeRoutes from '../../../../Routes/CustomRoutes';
import axios from "axios";

import server from '../../../../environment';
const client = axios.create({
    baseURL:`${server}/student`
})
function Popup({ id, setDisplayPopup }) {

    console.log(id)

    const [availableSlots,setAvailableSlots]=useState([]);

    const navigate = useNavigate(CustomeRoutes);


    function handleBookClick() {
        const select = document.querySelector('input[name="slot"]:checked');
        if(select){
            navigate(`book/${select}`); 
        }
        else{
            alert("Please Select Slot.");
        }
    }


    useEffect( () => {
        let fechData=async()=>{
            let response=await client.get(`/${id}/slots`);
            console.log(response.data.slots);
            //setAvailableSlots(response.data.slots)
        }
        fechData()
    }, [] );

    return (
        <div className="popup">
            <h2>Select Slot</h2>
            <div className="grid" >
                {
                    availableSlots.map( (val, index) => {
                        console.log(val)
                        return <label htmlFor={val} key={index}  >
                                <input type="radio" name="slot" id={val} />
                                <span className='slot' >{ val }</span>
                        </label>
                    } )
                }
            </div>
            <div className="popup-btn-wrapper">
                <button className='popup-btn' onClick={ () => handleBookClick()} id='book' >Book</button>
                <button className='popup-btn' onClick={ () => setDisplayPopup(false) } id='cancel' >Cancel</button>
            </div>
        </div>
    );
}

export default Popup;