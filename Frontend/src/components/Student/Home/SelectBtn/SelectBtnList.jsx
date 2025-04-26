import './SelectBtnList.css';
import { useLocation, useNavigate } from "react-router-dom";
import CustomeRoutes from "../../../../Routes/CustomRoutes";

const departmentData = [
    "IT", "Mechanical", "Civil", "Biotech", "Computer Science", "AI", "Data Science", "Electrical", "Electronic and Telecommunication"
];

function SelectBtnList() {
    
    const navigate = useNavigate(CustomeRoutes);
    const location = useLocation();

    function handleClick(value) {
        const pathParts = location.pathname.split("/");
        pathParts[pathParts.length - 1] = value;
        const newPath = pathParts.join("/");
        navigate(newPath);
    }

    return (
        <div className="home-select-btn-list">
            {
                departmentData.map( (val, index) => {
                    return <label key={index} htmlFor={val} className="home-select-btn" onClick={ (event) => handleClick(event.target.value) } >
                                <input type="radio" name="department" value={val} id={val} />
                                {val}
                           </label>
                } )
            }
        </div>
    );
}

export default SelectBtnList;