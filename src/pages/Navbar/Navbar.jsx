import React, { useState } from 'react';
import './navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext.js';
import { useUser } from '../../context/userContext.js';
import { useSelector } from 'react-redux';
import logo from "../Loading/482219503_122111766968774860_1765049624887787653_n.jpg"
import {MdRestaurantMenu} from "react-icons/md";

export default function Navbar() {
  const { countCart, countWishList } = useCart();
  const { countUsers } = useUser();
  const token = localStorage.getItem("token");
  const user = useSelector((x) => x.user.user);
  const navigate = useNavigate();
  const isPrivileged = user?.role === "admin" || user?.role === "moderator";
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const handleCloseMenu = () => setMenuOpen(false);

  console.log("UserNavIsNavUser",user)
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    navigate(query.trim() ? `/search?query=${query}` : ``);
  };

  function Logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  }

  return (
    <nav className="navbar">

    <div className="nav-content">
        <div className="nav-left">
          <Link onClick={handleCloseMenu} to="/" className="logo">
            <img src={logo} alt='logo'/>
            <h1 className='LogoText'>Pizza-Place</h1>
          </Link>
        </div>

        <div className="nav-center">
          <input
            type="text"
            placeholder="Search for products..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-box"
          />
        </div>

        <div className={`nav-right ${menuOpen ? 'menu-open' : ''}`}>
          {token && (
            <>
            
              <Link onClick={handleCloseMenu} to="/allProducts" className="icon-link">
 <MdRestaurantMenu size={28}  />   
            </Link>
              <Link onClick={handleCloseMenu} to="/cart" className="icon-link">
                <i className="fa fa-cart-plus"></i>
                <span className="count">{countCart}</span>
              </Link>

              <Link onClick={handleCloseMenu} to="/WishList" className="icon-link">
                <i className="fa fa-heart"></i>
                <span className="count">{countWishList}</span>
              </Link>
            </>
          )}

          {token && isPrivileged && (
            <Link onClick={handleCloseMenu} to="/AllUser" className="icon-link">
              <i className="fa fa-user"></i>
              <span className="count">{countUsers}</span>
            </Link>
          )}

          {token && (
            <Link onClick={handleCloseMenu} to="/meOrder" className="icon-link">
              <i className="fas fa-box"></i>
            </Link>
          )}

          {token && isPrivileged && (
            <Link onClick={handleCloseMenu} to="/adminPanel">
              <button className="admin-btn">Admin Panel</button>
            </Link>
          )}

          {token && (
            <Link onClick={handleCloseMenu}to={`/userDet/${user?.id||user?._id}`}
 className="profile-pic-link">
              <img
                className="profile-pic"
                src={
                  user?.image
                    ? user.image.startsWith("http")
                      ? user.image
                      : `${process.env.REACT_APP_API_URL}${user.image}`
                    : `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random&color=fff`
                }
                alt={user?.name || "User"}
              />
            </Link>
          )}

          {token ? (
            <button onClick={() => { setMenuOpen(false); Logout(); }} className="logout-btn">Logout</button>
          ) : (
            <Link onClick={handleCloseMenu} to="/login">
              <button className="login-btn">Login</button>
            </Link>
          )}
        </div>

        <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <i className="fa fa-bars"></i>
        </div>
      </div>
    </nav>
  );
}