import React from "react";
// import NewArrivals from "./NewArrivals"; // Assuming path is correct
// import StocksOnSale from "./StocksOnSale"; // Assuming path is corre
// import NewArrivals from "../../components/NewArrival/NewArrival";
// import StocksOnSale from "../../components/StocksOnSale/StocksOnSale";
import { useNavigate } from "react-router-dom";
import "./Market.css"

const Market = () => {

 const navigate = useNavigate();

  const handleClick = () => {
    navigate('/createStall');
  };

  return (
    <div className="market">
      <div className="market-head">
        <h1>Market</h1>
      </div>
      <div className="add-stallbtn">
        <button onClick={handleClick} >Build</button>
      </div>
    </div>
  );
};

export default Market;





