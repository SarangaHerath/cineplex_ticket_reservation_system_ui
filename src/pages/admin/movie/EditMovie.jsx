import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, TextareaAutosize } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './editMovieShowTime.scss';

export const EditMovie = (props) => {
  const { id } = props;
  const navigate = useNavigate();
console.log(id)
  const [formData, setFormData] = useState({
    movieName: '',
    movieDescription: '',
    selectedDate: '',
    selectedShowTimes: [
      {showTimeId:'', time: '08:00:00', date: '', availableSeats: '' },
      {showTimeId:'', time: '10:30:00', date: '', availableSeats: '' },
      {showTimeId:'', time: '20:00:00', date: '', availableSeats: '' },
    ],
  });
  const authToken = localStorage.getItem('auth_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/showTime/getMovieDetails/${id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const responseData = response.data;
        const { responseMovieDto, responseShowTimeDtoList } = responseData.data;
        console.log("Helllllll",responseData)
        setFormData({
          movieName: responseMovieDto.movieName,
          movieDescription: responseMovieDto.movieDescription,
          selectedDate: responseShowTimeDtoList[0].date, // Assuming the date is the same for all show times
          selectedShowTimes: responseShowTimeDtoList.map((showTime) => ({
            showTimeId:showTime.showTimeId,
            time: showTime.time,
            availableSeats: showTime.availableSeats,
            date: showTime.date,
          })),
        });
        console.log(responseShowTimeDtoList)
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };
    fetchData();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSeatsChange = (index, event) => {
    const availableSeats = event.target.value;

    if (availableSeats === '' || (Number(availableSeats) >= 0 && Number(availableSeats) <= 10)) {
      const selectedShowTimes = [...formData.selectedShowTimes];
      selectedShowTimes[index] = {
        ...selectedShowTimes[index],
        availableSeats: availableSeats,
      };

      setFormData({
        ...formData,
        selectedShowTimes,
      });
    } else {
      toast.error('Please enter a valid number of available seats (0-10)');
    }
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    setFormData({
      ...formData,
      selectedDate: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const formattedData = {
        movieId: id,
        movieName: formData.movieName,
        movieDescription: formData.movieDescription,
        requestShowTimeDtoList: formData.selectedShowTimes.map((showTime) => ({
          showTimeId:showTime.showTimeId,
          time: showTime.time,
          date: formData.selectedDate,  // Use the selectedDate for all show times
          availableSeats: showTime.availableSeats,
        })),
      };
  console.log(formattedData)
      const response = await axios.put(
        `http://localhost:8080/api/v1/movie/update`,
        formattedData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
  
      console.log(formattedData);
      toast.success('movie updated successfully');
  
      setTimeout(() => {
        // navigate(`/movie-details/${id}`);
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating movie:', error);
      toast.error(`Error updating movie: ${error.message}`);
    }
  };
  

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleFormSubmit} className="edit-movie-form">
        <Typography variant="h6">Edit movie</Typography>
        <div>
          <label>Movie Name:</label>
          <input
            type="text"
            name="movieName"
            value={formData.movieName}
            onChange={handleInputChange}
            required
            className="movie-input"
          />
        </div>
        <div>
          <TextareaAutosize
            placeholder="Movie Description"
            name="movieDescription"
            value={formData.movieDescription}
            onChange={handleInputChange}
            required
            className="movie-input"
          />
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="selectedDate"
            value={formData.selectedDate}
            onChange={handleDateChange}
            required
            className="movie-input"
          />
        </div>
        <div>
          <Typography variant="subtitle1">Show Times:</Typography>
          {formData.selectedShowTimes.map((showTime, index) => (
            <div key={index} className="show-time-container">
              <Typography className="show-time">{showTime.time}</Typography>
              <input
                type="number"
                max={10}
                min={0}
                placeholder="Available Seats"
                value={showTime.availableSeats}
                onChange={(e) => handleSeatsChange(index, e)}
                required
                className="movie-input"
              />
            </div>
          ))}
        </div>
        <Button type="submit" variant="contained" color="primary">
          Update movie
        </Button>
      </form>
    </div>
  );
};
