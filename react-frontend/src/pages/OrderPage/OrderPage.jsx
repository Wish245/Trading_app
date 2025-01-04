import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderPage.css";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flower = location.state?.flower;

  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Redirect to payment gateway with order details
    navigate("/payment", {
      state: {
        flower,
        quantity,
        total: quantity * parseFloat(flower.price.replace("$", "")),
      },
    });
  };

  if (!flower) {
    return <div>No flower selected. Please go back to the shop.</div>;
  }

  return (
    <div className="order-page">
      <h1>Order {flower.name}</h1>
      <div className="order-details">
        <img src={flower.image} alt={flower.name} />
        <p>{flower.description}</p>
        <p>Price per unit: {flower.price}</p>
      </div>
      <form onSubmit={handleSubmit} className="order-form">
        <label htmlFor="quantity">Quantity:</label>
        <input
          type="number"
          id="quantity"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          required
        />
        <p>Total: ${quantity * parseFloat(flower.price.replace("$", ""))}</p>
        <button type="submit" className="submit-button">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
