import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';
import { FaBars, FaSearch, FaUser, FaShoppingBag, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../pages/CartContext';
import CartPopup from '../components/CartPopup';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const location = useLocation();

  // Hide navbar on login and register pages
  const hideNavbar = location.pathname === '/user' || location.pathname === '/caccount';

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };

  // Close sidebar when clicking overlay
  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
  };

  return (
    <>
      {/* Top Navbar */}
      {!hideNavbar && (
        <div className="navbar">
          <div className="nav-left">
            <FaBars onClick={toggleSidebar} className="icon" />
            <FaSearch onClick={toggleSearch} className="icon" />
          </div>

          <div className="nav-center">
            <img src="./images/logo.jpeg" alt="Shuddh Swad" />
          </div>

          <div className="nav-right">
            {isAuthenticated() ? (
              <div className="user-info">
                <span className="user-name">Hi, {user?.name}</span>
                <FaSignOutAlt onClick={handleLogout} className="icon logout-icon" title="Logout" />
              </div>
            ) : (
              <Link to='/user'><FaUser className="icon" /></Link>
            )}
            <Link to='/cart' className="cart-link">
              <FaShoppingBag className="icon" />
              {cartCount > 0 && (
                <span className="cart-badge">{cartCount}</span>
              )}
            </Link>
          </div>
        </div>
      )}

      {/* Sidebar */}
      {!hideNavbar && (
        <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
          <ul>
            <li><Link to='/' onClick={toggleSidebar}>Home</Link></li>
            <li><Link to='/About' onClick={toggleSidebar}>About</Link></li>
            <li><Link to='/Orders' onClick={toggleSidebar}>Orders</Link></li>
            <li><Link to='/Track' onClick={toggleSidebar}>Track your order</Link></li>
            {isAuthenticated() ? (
              <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
            ) : (
              <li><Link to='/user' onClick={toggleSidebar}>Login</Link></li>
            )}
          </ul>
        </div>
      )}

      {/* Overlay for Sidebar */}
      {!hideNavbar && sidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      {/* Search Bar Overlay */}
      {!hideNavbar && searchOpen && (
        <div className="search-overlay">
          <div className="search-box">
            <input type="text" placeholder="Search" />
            <FaSearch className="search-icon" />
            <FaTimes className="close-icon" onClick={toggleSearch} />
          </div>
        </div>
      )}

      {/* Outlet */}
      <div className='outlet'>
        <Outlet />
      </div>

      {/* Cart Popup - Always render but only show when needed */}
      <CartPopup />
    </>
  );
};

export default Layout;
