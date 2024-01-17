// SingleMovie.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CalendarMonth, Chair } from '@mui/icons-material';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import './editUserReservation.scss';
import { Navbar } from '../../../component/navbar/Navbar';
import { ToastContainer, toast } from 'react-toastify';

export const EditUserReservation = ({ movieId, reservationId, onClose }) => {
    console.log("res idddddddd", reservationId);
    console.log("mov idddddddd", movieId);
  const [movieDetails, setMovieDetails] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reservationData, setReservationData] = useState({ noOfSeat: 1, showTimeId: '' });
  const authToken = localStorage.getItem('auth_token');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/showTime/getMovieDetails/${movieId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        console.log(response.data);
        setMovieDetails(response.data.data);
        // Set default showTimeId to the first show time
        setReservationData((prevData) => ({ ...prevData, showTimeId: response.data.data.responseShowTimeDtoList[0].showTimeId }));
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId, authToken]);

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const storedUserDetails = localStorage.getItem('userDetails');
  const user = storedUserDetails ? JSON.parse(storedUserDetails) : null;
console.log(reservationData.showTimeId)
  const handleReservation = async () => {
    try {
      const response = await axios.put(
        'http://localhost:8080/api/v1/reservation/update',
        {
          reservationId:reservationId,  
          noOfSeat: reservationData.noOfSeat,
          movieId: movieId,
          showTimeId: parseInt(reservationData.showTimeId, 10),

          userId: user.userId,
        },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log('Reservation successful:', response.data);
      toast.success('Update reservation successfully');

    setTimeout(() => {
      window.location.reload();
    }, 1500);
      handleDialogClose();
    } catch (error) {
      console.error('Error making reservation:', error);
      toast.error(`Error updating reservation: ${error.message}`);
    }
  };
  const [availableSeats, setAvailableSeats] = useState("");
  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/showTime/getAvailableSeat/${reservationData.showTimeId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        setAvailableSeats(response.data.data);
         } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchSeats();
  }, [reservationData.showTimeId]);
  if (!movieDetails) {
    return <div>Loading...</div>;
  }

  return (
    
      <div className="update-reservation-container"> 
        <ToastContainer />
            <form className="edit-reservation-form">
            <label className="form-title">Resavation Id</label>
              <div>
                <input
                  label="Reservation Id"
                  type="number"
                  value={reservationId}
                  fullWidth
                  className="rese-input"
                  disabled
                />
              </div>

              <label className="form-title">Select Time</label>
              <div>
                <select className="movie-select"
                  value={reservationData.showTimeId}
                  onChange={(e) => setReservationData((prevData) => ({ ...prevData, showTimeId: e.target.value || '' }))}
                  fullWidth
                >
                  {movieDetails.responseShowTimeDtoList.map((showTime) => (
                    <option key={showTime.showTimeId} value={showTime.showTimeId}>
                      {showTime.time}
                    </option>
                  ))}
                </select>
              </div>
              <label className="form-title">Add Seats</label>
              <div>
                <input
                  label="Number of Seats"
                  type="number"
                  value={reservationData.noOfSeat}
                  onChange={(e) => setReservationData((prevData) => ({ ...prevData, noOfSeat: e.target.value }))}
                  fullWidth
                  className="movie-input"
                  max={availableSeats}
                  min={0}
                />
              </div>
              <label className="form-title">Movie Id</label>
              <div>
                <input
                  label="Movie Id"
                  type="number"
                  value={movieId}
                  fullWidth
                  className="movie-input"
                  disabled
                />
              </div>
              <label className="form-title">User Id</label>
              <div>
                <input
                  label="User Id"
                  type="number"
                  value={user.userId}
                  fullWidth
                  className="movie-input"
                  disabled
                />
              </div>
            </form>      
            <Button onClick={handleReservation} variant="contained" color="primary">
              Update Reservation
            </Button>
      </div>
    
  );
};
