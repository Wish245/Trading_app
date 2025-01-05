import React, { useState, useEffect } from "react";
import "./NewArrival.css";
import { useNavigate } from "react-router-dom";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/new-arrivals")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch new arrivals");
        }
        return response.json();
      })
      .then((data) => {
        setNewArrivals(data.newArrivals);
      })
      .catch((error) => {
        console.error("Error fetching new arrivals:", error);
      });
  }, []);

  const openModal = (flower) => {
    setSelectedFlower(flower);
  };

  const closeModal = () => {
    setSelectedFlower(null);
  };

  const handleOrderClick = () => {
    navigate("/order", { state: { flower: selectedFlower } });
  };

  return (
    <div className="new-arrivals">
      <h2>New Arrivals</h2>
      <div className="cards-container">
        {newArrivals.map((stock) => (
          <div className="card" key={stock.id} onClick={() => openModal(stock)}>
            <img src={stock.image} alt={stock.name} />
            <h3>{stock.name}</h3>
            <p>${stock.price}</p>
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
            <p>${selectedFlower.price}</p>
            <button className="order-button" onClick={handleOrderClick}>
              Make Order
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewArrivals;
