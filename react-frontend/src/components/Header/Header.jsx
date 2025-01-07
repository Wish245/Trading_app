import React from "react";
import "./Header.css";
import HeaderImage from "./HeaderImage.jpeg"
const Header = () => {
  return (
    <div className="header" style={{backgroundImage: `url(${HeaderImage})`}}>
      <div className="header-contents">
        <h1>Flower Market </h1>
        <p>
          Buy and sell flowers. Best place to sell your harvst. Best place to
          find the flowers you need.
        </p>
        <button>Today best</button>
      </div>
    </div>
  );
};

export default Header;
