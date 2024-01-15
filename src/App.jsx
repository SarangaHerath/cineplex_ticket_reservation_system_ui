import React, { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { Login } from './pages/login/Login';
import { Home } from './pages/user/home/Home';
import { Register } from './pages/register/Register';
import { Admin } from './pages/admin/Admin';
import { ReservationList } from './pages/admin/reservationlist/ReservationList';
import { MovieList } from './pages/admin/movie/MovieList';
import { MovieShowTimeList } from './pages/admin/movie/MovieShowTimeList';
import { UsersList } from './pages/admin/user/UsersList';
import { SingleMovie } from './pages/user/singlemovie/SingleMovie';
import { UserReservations } from './pages/user/userreaervations/UserReservations';
import './App.css';

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user details exist in local storage
    const storedUserDetails = localStorage.getItem('userDetails');
    setIsUserLoggedIn(!!storedUserDetails);
  }, []);

  const userRole = JSON.parse(localStorage.getItem('userDetails') || '{}').roles;
  const isAdmin = userRole === 'ADMIN';

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to login or register page if not logged in */}
        {!isUserLoggedIn && (
          <>
            <Route path="/*" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Add other public routes as needed */}
          </>
        )}

        {/* Protected routes with Sidebar */}
        {isUserLoggedIn && (
          <>
            <Route path="/" element={isAdmin ? <MovieList /> : <Home />} />
            <Route path="/movieList" element={<MovieList />} />
            <Route path="/movieshowtimeList" element={<MovieShowTimeList />} />
            <Route path="/reservationList" element={<ReservationList />} />
            <Route path="/userreservationList" element={<UserReservations />} />
            <Route path="/userList" element={<UsersList />} />
            <Route path="/home" element={<Home />} />
            <Route path="/movie-details/:movieId" element={<SingleMovie />} />
          </>
        )}

        {/* Add a default route to handle unknown routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
