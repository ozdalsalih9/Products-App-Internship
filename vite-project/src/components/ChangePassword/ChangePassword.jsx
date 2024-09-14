import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css';

const ChangePassword = () => {
    const [Email, setEmail] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // New state for error message
    const navigate = useNavigate();

    const validateEmail = (email) => {
        // Simple email validation regex
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const changepass = async () => {
        // Reset error message
        setErrorMessage("");

        // Validate email
        if (!validateEmail(Email)) {
            setErrorMessage("Invalid email address");
            return;
        }

        const response = await fetch('http://localhost:5144/api/users/changepassword', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ Email, currentPassword, newPassword })
        });

        if (response.ok) {
            console.log("Password changed successfully.");
            navigate("/");
        } else {
            const result = await response.json();
            console.log("Error: ", result.message || "Password could not be changed.");
        }
    };

    return (
        <div className='changepass'>
            <h4>Change Password</h4>
            <hr />
            <br />
            <input 
                type="text" 
                name='Email' 
                value={Email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="Your Email" 
            />
            <br />
            <input 
                type="password" 
                name='currentPassword' 
                value={currentPassword} 
                onChange={e => setCurrentPassword(e.target.value)}
                placeholder="Current Password" 
            />
            <br />
            <input 
                type="password" 
                name='newPassword' 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)}
                placeholder="New Password" 
            />
            <br />
            <button onClick={changepass}>Save</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>} {/* Display error message */}
        </div>
    );
};

export default ChangePassword;
