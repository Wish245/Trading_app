import React from "react";
// import NewArrivals from "./NewArrivals"; // Assuming path is correct
// import StocksOnSale from "./StocksOnSale"; // Assuming path is corre
import NewArrivals from "../../components/NewArrival/NewArrival";
import StocksOnSale from "../../components/StocksOnSale/StocksOnSale";
import "./Market.css"

const Market = () => {
  return (
    <div className="market">
      {/* New Arrivals Section */}
      <section className="new-arrivals-section">
        <NewArrivals />
      </section>

      {/* Stocks on Sale Section */}
      <StocksOnSale />
    </div>
  );
};

export default Market;
