import React, { useState } from 'react';
import { TextareaAutosize, Button, Typography } from '@mui/material';
import './addMovie.scss';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AddMovie = () => {
  const navigate = useNavigate();
  const authToken = localStorage.getItem('auth_token');

  const initialShowTimeList = [
    { time: '08:00:00', availableSeats: '' },
    { time: '10:30:00', availableSeats: '' },
    { time: '20:00:00', availableSeats: '' }
  ];

  const [formData, setFormData] = useState({
    movieName: '',
    movieDescription: '',
    selectedDate: '',
    selectedShowTimes: initialShowTimeList,
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
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
      // Notify the user about invalid input
      toast.error('Please enter a valid number of available seats (0-10)');
    }
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    setFormData({ ...formData, selectedDate: value });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (authToken) {
      try {
        const formattedData = {
          movieName: formData.movieName,
          movieDescription: formData.movieDescription,
          requestShowTimeDtoList: formData.selectedShowTimes.map((showTime) => ({
            time: showTime.time,
            date: formData.selectedDate,
            availableSeats: showTime.availableSeats
          })),
        };

        const response = await axios.post(
          'http://localhost:8080/api/v1/movie/save',
          formattedData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );

        console.log('Movie added successfully:', response.data);
        toast.success('Movie added successfully');

        setFormData({
          movieName: '',
          movieDescription: '',
          selectedDate: '',
          selectedShowTimes: initialShowTimeList,
        });

        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (error) {
        console.error('Error adding movie:', error);
        toast.error('Error adding movie. Please try again.');
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleFormSubmit} className="add-movie-form">
        <label className="form-title">Add New Movie</label>
        <div>
          <input
            type="text"
            placeholder="Movie Name"
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
          Add Movie
        </Button>
      </form>
    </div>
  );
};
