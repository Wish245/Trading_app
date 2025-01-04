import React, { useState } from "react";
import "./StocksOnSale.css";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const flowerStocks = [
  {
    id: 1,
    name: "Rose Mahela",
    image: assets.RedRose,
    price: "$20",
    // salePrice: "$15",
    description: "Fresh red roses in a beautiful bouquet.",
  },
  {
    id: 2,
    name: "Tulip Kosol",
    image: assets.Tulip,
    price: "$15",
    // salePrice: "$12",
    description: "Colorful tulips perfect for any occasion.",
  },
  {
    id: 3,
    name: "Sunflower Bumrah",
    image: assets.Sunflower,
    price: "$12",
    // salePrice: "$9",
    description: "Bright sunflowers to brighten your day.",
  },
];

const StocksOnSale = () => {
  const [selectedFlower, setSelectedFlower] = useState(null);
  const navigate = useNavigate();

  const openModal = (flower) => {
    setSelectedFlower(flower);
  };

  const closeModal = () => {
    setSelectedFlower(null);
  };

  const handleOrderClick = () => {
    // Redirect to the order page with optional flower details
    navigate("/order", { state: { flower : selectedFlower } });
  };

  return (
    <section className="stocks-on-sale-section">
      <h2>Stocks on Sale</h2>
      <div className="cards-container">
        {flowerStocks.map((stock) => (
          <div className="card" key={stock.id} onClick={() => openModal(stock)}>
            <img src={stock.image} alt={stock.name} />
            <h3>{stock.name}</h3>
            <p>
              <span className="original-price">{stock.price}</span>
              {/* <span className="sale-price">{stock.salePrice}</span> */}
            </p>
          </div>
        ))}
      </div>

      {selectedFlower && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <img
              src={selectedFlower.image}
              alt={selectedFlower.name}
              style={{ width: "100%", borderRadius: "8px" }}
            />
            <h2>{selectedFlower.name}</h2>
            <p>
              <span className="original-price">{selectedFlower.price}</span>
              {/* <span className="sale-price">{selectedStock.salePrice}</span> */}
            </p>
            <p>{selectedFlower.description}</p>
            <button className="order-button" onClick={handleOrderClick}>
              Make Order
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default StocksOnSale;
