import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { jwtDecode } from 'jwt-decode'; // Import jwtDecode correctly
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState(null); // State to store the user role

  const navigate = useNavigate(); // Initialize useNavigate hook

  const login = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5144/api/users/login", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result.token); // Store token

        const decodedToken = jwtDecode(result.token);
        const userRole = decodedToken.role;
        setRole(userRole);

        localStorage.setItem("userRole", userRole); // Store role in localStorage
        setSuccessMessage('Login successful');
        setErrorMessage('');

        // Perform navigation here
        if (userRole === 'Admin') {
          navigate('/admin/products'); // Admin redirect
        } else {
          navigate('/user/uIndex'); // User redirect
        }
      } else {
        const error = await response.json();
        setIsLoading(false);
        setSuccessMessage('');
        setErrorMessage(error.message || 'Invalid login credentials.');
      }
    } catch (error) {
      setIsLoading(false);
      setSuccessMessage('');
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className='LoginForm'>
      {!role ? (
        <div className='form-container'>
          <h5 className='logo'>ProductsApp</h5>
          <h4>Login</h4>
          <hr />
          <br />
          <div className="form-group">
            <input 
              type="email" 
              name='email' 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder=' ' 
            />
            <label htmlFor="email">Email</label>
          </div>
          <div className="form-group">
            <input 
              type="password" 
              name='password' 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder=' ' 
            />
            <label htmlFor="password">Password</label>
          </div>
          <div id='button'>
            <button id='button1' onClick={login} disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </button>
            <button id='button2' onClick={() => navigate("/changepassword")}>Forgot Password?</button>
            
            <a id='noaccount' onClick={() => window.location.href = "/register"}>Don't have an account?</a>
          </div>
          
          {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
      ) : null}
    </div>
  );
};

export default LoginForm;
