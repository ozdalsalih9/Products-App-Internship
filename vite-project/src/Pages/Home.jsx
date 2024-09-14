import React from 'react';
import { useState } from 'react';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  

  const login = async () => {
    const response = await fetch("http://localhost:5144/api/users/login", {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify({ email, password })
    });

    const result = await response.json();
    localStorage.setItem("token", JSON.stringify(result.token));
  };

  return (
    <div id='loginForm'>
      <label htmlFor="email">Email:  </label>
      <input 
        type="email" 
        name='email' 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
      />
      <br />
      <label htmlFor="password">Password:  </label>
      <input 
        type="password" 
        name='password' 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <div id='button'><button onClick={login}>Login</button></div>
    </div>
  );
};

export default LoginForm;
