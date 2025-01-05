import React, { useState, useEffect } from "react";
import "./StocksOnSale.css";
import { useNavigate } from "react-router-dom";

const StocksOnSale = () => {
  const [stocksOnSale, setStocksOnSale] = useState([]);
  const [selectedFlower, setSelectedFlower] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/stocks-on-sale")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch stocks on sale");
        }
        return response.json();
      })
      .then((data) => {
        setStocksOnSale(data.stocksOnSale);
      })
      .catch((error) => {
        console.error("Error fetching stocks on sale:", error);
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
    <section className="stocks-on-sale-section">
      <h2>Stocks on Sale</h2>
      <div className="cards-container">
        {stocksOnSale.map((stock) => (
          <div className="card" key={stock.id} onClick={() => openModal(stock)}>
            <img src={stock.image} alt={stock.name} />
            <h3>{stock.name}</h3>
            <p>
              <span className="original-price">${stock.price}</span>
              {stock.salePrice && (
                <span className="sale-price">${stock.salePrice}</span>
              )}
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
              <span className="original-price">${selectedFlower.price}</span>
              {selectedFlower.salePrice && (
                <span className="sale-price">${selectedFlower.salePrice}</span>
              )}
            </p>
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
