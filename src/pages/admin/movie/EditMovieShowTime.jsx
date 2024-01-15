import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, TextareaAutosize } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './editMovieShowTime.scss';

export const EditMovieShowTime = (props) => {
  const { id } = props;
  console.log(id)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    showTimeId:'',
    time: '',
    availableSeats: '',
    selectedDate: '',
    responseMovieDto: {
      movieId: '',
      movieName: '',
      movieDescription: '',
    },
  });

  const [open, setOpen] = useState(false);
  const authToken = localStorage.getItem('auth_token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/showTime/getById/${id}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const responseData = response.data;
        const {showTimeId, time, availableSeats, date, responseMovieDto } = responseData.data;

        // Ensure that responseMovieDto is defined before extracting movie details
        const movieDetails = responseMovieDto
          ? {
              movieId: responseMovieDto.movieId,
              movieName: responseMovieDto.movieName,
              movieDescription: responseMovieDto.movieDescription,
            }
          : {};

        setFormData({
          showTimeId,
          time,
          availableSeats,
          selectedDate: date,
          responseMovieDto: movieDetails,
        });

        setOpen(true);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchData();
  }, [id, authToken]);

  const handleClose = () => {
    setOpen(false);
  };

  const handleSeatsChange = (event) => {
    const { value } = event.target;
  
    if (value === '' || (Number(value) >= 0 && Number(value) <= 10)) {
      setFormData((prevData) => ({
        ...prevData,
        availableSeats: value,
      }));
    } else {
      // Notify the user about invalid input
      toast.error('Please enter a valid number of available seats (0-10)');
    }
  };

  const handleDateChange = (event) => {
    const { value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      selectedDate: value,
    }));
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const formattedData = {
       
        showTimeId: formData.showTimeId,
        time: formData.time,
        movieId: formData.responseMovieDto.movieId,
        date: formData.selectedDate,
        availableSeats: formData.availableSeats,
       
      };
      console.log(formattedData)
      const response = await axios.put(`http://localhost:8080/api/v1/showTime/update`, formattedData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
console.log("",formattedData)
      console.log('Show time updated successfully:', response.data);
      handleClose();
      toast.success('Show time updated successfully');
      setTimeout(() => {
        // window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error updating show time:', error);
      toast.error(`Error updating show time: ${error.message}`);
      setTimeout(() => {
        // window.location.reload();
      }, 1500);
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={handleFormSubmit} className="edit-movie-form">
        <Typography variant="h6">Edit Show Time Seats</Typography>
        <div>
          <label>Time</label>
          <input
            label="Time"
            name="time"
            value={formData.time}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
            className="movie-input"
            disabled
          />
        </div>
        <div>
          <label>Available Seats</label>
          <input
            label="Available Seats"
            name="availableSeats"
            value={formData.availableSeats}
            onChange={handleSeatsChange}
            fullWidth
            margin="normal"
            className="movie-input"
            type='number'
            max={10}
            min={0}
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
            disabled
          />
        </div>
        <div>
          <label>Movie Name:</label>
          <input
            label="Movie Name"
            name="movieName"
            value={formData.responseMovieDto.movieName}
            InputProps={{ readOnly: true }}
            fullWidth
            margin="normal"
            className="movie-input"
            disabled
          />
        </div>
        <div>
          <label>Movie Description:</label>
          <TextareaAutosize
            placeholder="Movie Description"
            name="movieDescription"
            value={formData.responseMovieDto.movieDescription}
            readOnly
            className="movie-input"
            disabled
          />
        </div>
        <Button type="submit" variant="contained" color="primary">
          Update Show Time
        </Button>
      </form>
    </div>
  );
};
