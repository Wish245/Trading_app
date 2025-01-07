import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { assets } from "../../assets/assets";
import axios from "axios"

const NavBar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); // Check if user is logged in

  const handleLogout = async () => {
  try {
    // Call the backend logout API
    await axios.post("http://localhost:8080/api/logout");

    // Remove userId from local storage
    localStorage.removeItem("userId");

    // Redirect to the home page
    navigate("/");
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={assets.logo} alt="FlowerMarket Logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/market">Market</Link>
        </li>
        <li>
          <Link to="">About</Link>
        </li>
        <li>
          <Link to="">Contact</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <div className="navbar-login">
        {userId ? ( // If user is logged in, show logout button
          <button onClick={handleLogout}>Logout</button>
        ) : ( // If user is not logged in, show login button
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;