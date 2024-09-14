import React from "react";
import { useNavigate } from "react-router-dom";
import './Logout.css'

const Logout = () => {
    const navigate = useNavigate();

    const out = () => 
    {
        const token = localStorage.getItem("token"); 
        if (!token) 
        {
            alert("You did not login!");
            return;
        }

        localStorage.removeItem('token');
        navigate("/");
    }

    return (
        <div className="logout">
            <div className="btn"></div>
            <h3>Are you sure?</h3>
            <div className="btn">
                <button className="btn btn-success" onClick={out}>Yes</button>
                <button className="btn btn-danger">No</button>
            </div> 
        </div>
    )
}

export default Logout;
