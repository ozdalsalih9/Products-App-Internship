import React from 'react';
import { useState } from 'react';

import { useNavigate } from 'react-router-dom'; 

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");

  const Register = async () => {
    const response = await fetch("http://localhost:5144/api/users/register", {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ email, password, userName, fullName })
    });

    const result = await response.json();
    console.log(result);
  };

  return (
    <div id='RegisterForm'>
      <label htmlFor="userName">Kullanıcı Adı:  </label>
      <input 
        type="text" 
        name='userName' 
        value={userName} 
        onChange={(e) => setUserName(e.target.value)} 
      />
      <br />
      <label htmlFor="fullName">Ad Soyad </label>
      <input 
        type="text" 
        name='fullName' 
        value={fullName} 
        onChange={(e) => setFullName(e.target.value)} 
      />
      <br />

      <label htmlFor="email">Email:  </label>
      <input 
        type="email" 
        name='email' 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <br />
      <label htmlFor="password">Şifre:  </label>
      <input 
        type="password" 
        name='password' 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />  

      <div><button onClick={Register}>Register</button></div>

      
      
    </div>
  );
};

export default RegisterForm;
