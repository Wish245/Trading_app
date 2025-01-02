import React, { useState } from "react";
import "./NewArrival.css";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
const flowerStocks = [
  {
    id: 1,
    name: "Rose Bouquet",
    image: assets.RedRose,
    price: "$20",
    description: "Fresh red roses in a beautiful bouquet.",
  },
  {
    id: 2,
    name: "Tulip Set",
    image: assets.Tulip,
    price: "$15",
    description: "Colorful tulips perfect for any occasion.",
  },
  {
    id: 3,
    name: "Sunflower Bunch",
    image: assets.Sunflower,
    price: "$12",
    description: "Bright sunflowers to brighten your day.",
  },
];

const NewArrivals = () => {
  const [selectedFlower, setSelectedFlower] = useState(null);

  const openModal = (flower) => {
    setSelectedFlower(flower);
  };
  const closeModal = () => {
    setSelectedFlower(null);
  };

  return (
    <div className="new-arrivals">
      <h2>New Arrivals</h2>
      <div className="cards-container">
        {flowerStocks.map((stock) => (
          <div className="card" key={stock.id} onClick={() => openModal(stock)}>
            <img src={stock.image} alt={stock.name} />
            <h3>{stock.name}</h3>
            <p>{stock.price}</p>
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
            <p>{selectedFlower.price}</p>
            <p>{selectedFlower.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
