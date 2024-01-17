// UserDetails.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "./userProfile.scss"
import { Navbar } from '../../../component/navbar/Navbar';
const UserProfile = () => {

  const { userId } = useParams();
  const [userData, setUserData] = useState(null);
  const authToken = localStorage.getItem('auth_token'); // Assuming you store the JWT token in local storage

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/user/getById/${userId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data);
        setUserData(response.data.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId, authToken]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
     
     
      <Navbar></Navbar>
        <div className="single-movie-container">
        <h2>User Details</h2>
      
       <div className="userdetails">
         <div className="userdetails-section">
         
          <p>User ID: {userData.userId}</p>
          <p>First Name: {userData.firstName}</p>
          <p>Last Name: {userData.lastName}</p>
          <p>User Name: {userData.userName}</p>
         </div>
 
        
       
        
         
       </div>
       </div>
    </div>
    
  );
};

export default UserProfile;
