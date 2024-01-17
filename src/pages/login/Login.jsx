import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import './login.scss';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
const navigate=useNavigate();
const handleLogin = async (e) => {
  e.preventDefault();
  
  try {
    // Make the API call
    const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', formData);
    console.log(response.data)
  
    const { token, user } = response.data;
    console.log(user)
    // Store authentication token in local storage
    localStorage.setItem('auth_token', token);

    // Store additional user details in local storage
    localStorage.setItem('userDetails', JSON.stringify(user));
    console.log('Login Successful:', response.data);

    // Navigate to the desired page (you can customize this based on your application)
    setTimeout(() => {
      navigate(`/`);
      window.location.reload();
    }, 1500);
  } catch (error) {
    // Handle errors (e.g., display an error message)
    console.error('Error during login:', error.message);
  }
};

  return (
    <div className="login-container">
      <div className='login-wrapper'>
      <div className="form-container">
        <form onSubmit={handleLogin}>
          <label>Login</label>
          <TextField
            type="text"
            variant="outlined"
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          <TextField
            type="password"
            variant="outlined"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
          <Link to={'/register'}>
          <span>You don't have a account register now</span>
          </Link>
        </form>
      </div>
      <div className="background-container">
       <img src="http://localhost:5173/src/assets/353202002.jpg" alt="" />
      </div>
      </div>
    </div>
  );
};
