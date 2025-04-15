import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./NavBar.css";
import { assets } from "../../assets/assets";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Get JWT token

  const handleLogout = async () => {
    try {
      // Call the backend logout API with token in Authorization header
      await axios.post(
        "http://localhost:8000/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Remove token and user data from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userId"); // Optional, if you're using it elsewhere

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const scrollToContact = () => {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
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
          <Link to="" onClick={scrollToContact}>About</Link>
        </li>
        <li>
          <Link to="" onClick={scrollToContact}>Contact</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
      </ul>
      <div className="navbar-login">
        {token ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
