import { useEffect, useState } from 'react';
import './Popup.css';
import { useNavigate } from 'react-router';
import CustomeRoutes from '../../../../Routes/CustomRoutes';
import axios from "axios";
import server from '../../../../environment';

const client = axios.create({
    baseURL: `${server}/student`
});

function Popup({ id, setDisplayPopup }) {

    const [availableSlots, setAvailableSlots] = useState([]);
    const navigate = useNavigate(CustomeRoutes);

    function handleBookClick() {
        const select = document.querySelector('input[name="slot"]:checked');
        if (select) {
            navigate(`${id}/book/${select.value}`);  // Using value which holds the _id
        } else {
            alert("Please select a slot.");
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (id) {
                    const response = await client.get(`/${id}/slots`);
                    console.log(response.data.slots);
                    setAvailableSlots(response.data.slots);
                } else {
                    console.log("id is invalid");
                }
            } catch (error) {
                console.error("Error fetching slots:", error);
                setAvailableSlots([]); // fallback in case of error
            }
        };
        fetchData();
    }, [id]);

    return (
        <div className="popup">
            <h2>Select Slot</h2>
            <div className="grid">
                {
                    availableSlots.map((slot, index) => (
                        
                        <label htmlFor={`slot-${index}`} key={slot._id}>
                            <input
                                type="radio"
                                name="slot"
                                id={`slot-${index}`}
                                value={slot._id}
                                disabled={slot.isBooked}
                            />
                            <span className="slot">
                                {slot.start} {/*slot.end*/} {slot.isBooked ? "(Booked)" : ""}
                            </span>
                        </label>
                    ))
                }
            </div>
            <div className="popup-btn-wrapper">
                <button className="popup-btn" onClick={handleBookClick} id="book">Book</button>
                <button className="popup-btn" onClick={() => setDisplayPopup(false)} id="cancel">Cancel</button>
            </div>
        </div>
    );
}

export default Popup;
