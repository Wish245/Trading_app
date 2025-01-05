import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderPage.css";

const OrderPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flower = location.state?.flower;

  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User not logged in. Please log in to place an order.");
      return;
    }

    const total = quantity * parseFloat(flower.price.replace("$", ""));
    const orderData = {
      flowerId: flower.id,
      quantity: parseInt(quantity),
      total,
      user_id: userId,
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message);
        navigate("/payment", { state: { flower, quantity, total } });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to place order.");
      }
    } catch (err) {
      console.error("Error placing order:", err);
      setError("An error occurred while placing the order.");
    }
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
        {error && <p className="error-message">{error}</p>}
        <button type="submit" className="submit-button">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default OrderPage;
