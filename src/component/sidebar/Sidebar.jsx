import React, { useState, useEffect } from 'react';
import { FaDashcube, FaJediOrder, FaBullseye, FaListOl, FaUser } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import './sidebar.scss';

import { Navbar } from '../navbar/Navbar';

export const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => setIsOpen(!isOpen);

  const userRole = JSON.parse(localStorage.getItem('userDetails') || '{}').roles;
  console.log(userRole);

  const isAdmin = userRole === 'ADMIN';
  const isUser = userRole === 'USER';

  const generateMenuItems = () => {
    if (isAdmin) {
      return [
        { path: '/reservationList', name: 'Reservations', icon: <FaJediOrder style={{ color: 'orange' }} /> },
        { path: '/movieList', name: 'Movie List', icon: <FaBullseye style={{ color: 'white' }} /> },
        { path: '/movieshowtimeList', name: 'Movie Show Time List', icon: <FaListOl style={{ color: 'pink' }} /> },
        { path: '/userList', name: 'Users List', icon: <FaUser style={{ color: 'yellow' }} /> },
      ];
    } else {
      return [];
    }
  };

  const menuItem = generateMenuItems();

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

  useEffect(() => {
    const handleResize = () => {
      setIsOpen(window.innerWidth > 1368); // Adjust the threshold as needed
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="container">
     { isAdmin?<div
        style={{
          width: isOpen ? '250px' : '60px',
          borderRight: isOpen ? '1px solid rgb(62, 62, 62)' : 'none',
          flex: isOpen ? '1' : 'none',
        }}
        className="sidebar"
      >
        <div className="top_section">
          {/* <NavLink to="/" className="logo-link" activeClassName="active"> */}
            <h1 style={{ display: isOpen ? 'block' : 'none' }} className="logo">
              CINEPLEX THEATER
            </h1>
          {/* </NavLink> */}
          <div style={{ marginLeft: isOpen ? '0px' : '0px' }} className="bars">
            <MenuOpenIcon className="MenuOpenIcon" onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <NavLink to={item.path} className="link" activeClassName="active" key={index}>
            <div className="icon">{item.icon}</div>
            <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
              {item.name}
            </div>
          </NavLink>
        ))}
        <div className="link" onClick={handleLogout}>
          <div className="icon">🚪</div>
          <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
            Logout
          </div>
        </div>
      </div>:""}
      <div className="main-wrapper">
        {isUser ? <Navbar /> : ''}
        <main>{children}</main>
      </div>
    </div>
  );
};