import React from 'react';
import { useState } from 'react';
import './Register.css'
import { useNavigate } from 'react-router-dom'; 

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  
  const Register = async () => {
    try {
      const response = await fetch("http://localhost:5144/api/users/register", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('tokens')}`
        },
        method: "POST",
        body: JSON.stringify({ email, password, userName, fullName })
      });
  
      if (response.ok) {
        setSuccessMessage("Registration Successful.");
        setErrorMessage('');
        navigate("/")
      } else {
        const error = await response.json();
        setErrorMessage("Registration Failed: " + (error.message || "You cannot give any null information"));
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage("An error occurred during registration.");
      setSuccessMessage('');
    }
  };

  return (
    <div id='RegisterForm'>
      <div className='title'>
        <h4>Register</h4> 
      </div>
      
      <label htmlFor="userName">Username</label>
      <input 
        type="text" 
        name='userName' 
        value={userName} 
        placeholder='Username'
        onChange={(e) => setUserName(e.target.value)} 
      />
      <br />
      <label htmlFor="fullName">Full Name</label>
      <input 
        type="text" 
        name='fullName' 
        value={fullName} 
        placeholder='Full Name'
        onChange={(e) => setFullName(e.target.value)} 
      />
      <br />

      <label htmlFor="email">Email</label>
      <input 
        type="email" 
        name='email' 
        value={email} 
        placeholder='Email'
        onChange={(e) => setEmail(e.target.value)} 
      />
      <br />
      <label htmlFor="password">Password</label>
      <input 
        type="password" 
        name='password' 
        value={password} 
        placeholder='Password'
        onChange={(e) => setPassword(e.target.value)} 
      />

      <div><button className='mt-3' onClick={Register}>Register</button></div>
      <br />
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      
    </div>
  );
};

export default RegisterForm;
