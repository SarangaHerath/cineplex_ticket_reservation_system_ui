import React from 'react';
import './navbar.scss';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Link, useNavigate } from 'react-router-dom';
export const Navbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('userDetails');

    // Redirect to login page
    setTimeout(() => {
      navigate('/');
      window.location.reload();
    }, 1500);
  };
  return (
    <div className='wrapper'>
      <div className='navbar'>
     
     <div className='search-bar'>
       
     <h1 style={{}} className="logo">
              CINEPLEX THEATER
            </h1>
     </div>
     <div className='nav-right'>
    
     <Link to={"/home"} style={{textDecoration:"none"}}>
        <h4>Home</h4>
     </Link>
     <Link to={"/userreservationList"} style={{textDecoration:"none"}}>
     <h4>Reservation List</h4> </Link>
     <div  onClick={handleLogout} style={{cursor:"pointer",color:'red'}}>
     <h4>Logout</h4>
            
        
          </div>
     <div className='profile-icon'>
     </div>
     </div>
   </div>
    </div>
  );
};
