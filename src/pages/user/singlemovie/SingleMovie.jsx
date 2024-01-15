// SingleMovie.js
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { CalendarMonth, Chair } from '@mui/icons-material';
import './singleMovie.scss';
import { Sidebar } from '../../../component/sidebar/Sidebar';
import { Navbar } from '../../../component/navbar/Navbar';

export const SingleMovie = () => {
    const { movieId } = useParams();
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
    
    console.log(user);
    const handleReservation = async () => {
      try {
        const response = await axios.post('http://localhost:8080/api/v1/reservation/save', {
          noOfSeat: reservationData.noOfSeat,
          movieId: movieId,
          showTimeId: reservationData.showTimeId,
          userId:user.userId,
        },
        {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
  
        console.log('Reservation successful:', response.data);
        handleDialogClose();
      } catch (error) {
        console.error('Error making reservation:', error);
      }
    };
  
    if (!movieDetails) {
      return <div>Loading...</div>;
    }
   
    
  return (
 <> <Navbar></Navbar>
  <div className="single-movie-container">
       
       <h2>{movieDetails.responseMovieDto.movieName}</h2>
       <div className="movie-details">
         <div className="movie-details-section">
         
           <span>{movieDetails.responseMovieDto.movieDescription}</span>
         </div>
 
        
         <div className="show-times-list">
           {movieDetails.responseShowTimeDtoList.map((showTime) => (
             <div key={showTime.showTimeId}>
               <div className="show-time">
                 <div className="show-time-div">
                   <CalendarMonth />
                   <p>{showTime.time}</p>
                 </div>
                 <div className="show-time-div">
                   <Chair />
                   <p>Seats: {showTime.availableSeats}</p>
                 </div>
               </div>
             </div>
           ))}
         </div>
         <div className='buttondiv'>
         <button className="book-tickets-btn" onClick={handleDialogOpen}>
             Book Reservation
           </button>
         </div>
         
       </div>
       <Dialog open={openDialog} onClose={handleDialogClose} className="MuiDialog-root">
           <DialogTitle>Book Reservation</DialogTitle>
           <DialogContent className="MuiDialog-root-form">
           <form  className="add-reservation-form">
           <label className="form-title">Select Time</label>
           <div>
              <select  className="movie-select"
               value={reservationData.showTimeId}
               onChange={(e) => setReservationData((prevData) => ({ ...prevData, showTimeId: e.target.value }))}
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
               onChange={(e) => setReservationData({ noOfSeat: e.target.value })}
               fullWidth
               className="movie-input"
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
             /> </div>
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
            
           </DialogContent>
           <DialogActions>
           
             <Button onClick={handleReservation} variant="contained" color="primary">
               Confirm Reservation
             </Button>
           </DialogActions>
         </Dialog>
     </div>
 </>
   
  
  );
};
