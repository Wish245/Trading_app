import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src="/assets/logo.png" alt="FlowerMarket Logo" />
        </Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="">Home</Link>
        </li>
        <li>
          <Link to="">Market</Link>
        </li>
        <li>
          <Link to="">About</Link>
        </li>
        <li>
          <Link to="">Contact</Link>
        </li>
        <li>
          <Link to="">Profile</Link>
        </li>
      </ul>
      <div className="navbar-login">
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;
