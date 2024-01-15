// Home.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Sidebar } from '../../../component/sidebar/Sidebar';
import './Home.scss'; // Import the SCSS file
import { CalendarMonth, Chair } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Navbar } from '../../../component/navbar/Navbar';

const ShowTimeCard = ({ showTimes }) => {
  return (
    <Link to={`/movie-details/${showTimes[0].responseMovieDto.movieId}`} >
    <div className="show-time-card">
      <h3>{showTimes[0].responseMovieDto.movieName}</h3>
      <hr />
      <h4>Date: {showTimes[0].date}</h4>
      <div className='show-time-wrapper'>   
      {showTimes.map((showTime) => (
 
          <div className='show-time' key={showTime.showTimeId}>
            <div className='show-time-div'>
            <CalendarMonth></CalendarMonth>
            <p>{showTime.time}</p>
            </div>
            <div className='show-time-div'>
            <Chair></Chair><p> Seats: {showTime.availableSeats}</p>
            </div>
           
        </div>
       
      ))}
       </div>
    </div>
    </Link>
  );
};
export const Home = () => {
  const [showTimes, setShowTimes] = useState([]);
  const authToken = localStorage.getItem('auth_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/showTime/getAll', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setShowTimes(response.data.data);
      } catch (error) {
        console.error('Error fetching show times:', error);
      }
    };
    fetchData();
  }, []);

  // Group show times by movie
  const groupedShowTimes = Object.values(
    showTimes.reduce((acc, showTime) => {
      const movieId = showTime.responseMovieDto.movieId;
      if (!acc[movieId]) {
        acc[movieId] = [];
      }
      acc[movieId].push(showTime);
      return acc;
    }, {})
  );

  return (
   <><Navbar></Navbar>
      <div className="show-time-container">
        {groupedShowTimes.map((group, index) => (
          <ShowTimeCard key={index} showTimes={group} />
        ))}
      </div>
      </>
  );
};
