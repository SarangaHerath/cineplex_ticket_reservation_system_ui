
import React, { useState, useEffect } from 'react';
import { FaTh, FaUserAlt, FaShoppingBag, FaBuilding, FaShoppingBasket, FaFileInvoice, FaMapMarkedAlt, FaDownload, FaSellcast, FaMoneyCheck, FaAccessibleIcon, FaBullseye } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import './sidebar.scss';
import { RadioButtonUnchecked } from '@mui/icons-material';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
export const Sidebar = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggle = () => setIsOpen(!isOpen);
  const [isMainMenuOpen, setIsMainMenuOpen] = useState(false);

  const toggleMainMenu = () => {
    setIsMainMenuOpen(!isMainMenuOpen);
  };
  
  const toggleSubMenu = (index) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };
  // const toggle = () => setIsOpen(!isOpen);

  const menuItem = [
    { path: '/admin', name: 'Dashboard', icon: <FaTh style={{ color: 'blue' }} /> },
    { path: '/reservations', name: 'Reservations', icon: <FaTh style={{ color: 'blue' }} /> },
    { path: '/movieList', name: 'Movie List', icon: <FaTh style={{ color: 'blue' }} /> },
    { path: '/showtimes', name: 'Show Times', icon: <FaShoppingBag style={{ color: 'peru' }} /> },
   
  ];

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
      <div
        style={{
          width: isOpen ? '250px' : '60px',
          borderRight: isOpen ? '1px solid rgb(62, 62, 62)' : 'none',
          flex: isOpen ? '1' : 'none',
        }}
        className="sidebar"
      >
        <div className="top_section">
          <NavLink to="/" className="logo-link" activeClassName="active">
            <h1 style={{ display: isOpen ? 'block' : 'none' }} className="logo">
            CINEPLEX THEATER
            </h1>
          </NavLink>
          <div style={{ marginLeft: isOpen ? '0px' : '0px' }} className="bars">
            <MenuOpenIcon className="MenuOpenIcon" onClick={toggle} />
          </div>
        </div>
        {menuItem.map((item, index) => (
          <div key={index}>
            {item.submenu ? (
              <div
                className="link"
                onClick={() => {
                  toggleSubMenu(index);
                }}
              >
                <div className="icon">{item.icon}</div>
                <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
                  {item.name}
                </div>
              </div>
            ) : (
              <NavLink to={item.path} className="link" activeClassName="active">
                <div className="icon">{item.icon}</div>
                <div style={{ display: isOpen ? 'block' : 'none' }} className="link_text">
                  {item.name}
                </div>
              </NavLink>
            )}
            {item.submenu && expandedMenus[index] && isOpen && (
              <div className="submenu" style={{ marginLeft: '50px', fontSize: '12px' }}>
                {item.submenu.map((subItem, subIndex) => (
                  <NavLink key={subIndex} to={subItem.path} className="link" activeClassName="active">
                    <FaBullseye className="MenuOpenIcon" onClick={toggle} />
                    <div className="link_text" style={{ fontSize: '12px' }}>
                      {subItem.name}
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="main-wrapper">
        
        <main>{children}</main>
      </div>
    </div>
  );
};