import React from "react";
import { useLocation } from "react-router-dom";
import "./PaymentPage.css";

const PaymentPage = () => {
  const location = useLocation();
  const { flower, quantity, total } = location.state || {};

  if (!flower) {
    return <div>No order details found. Please go back and try again.</div>;
  }

  return (
    <div className="payment-page">
      <h1>Payment Gateway</h1>
      <p>Flower: {flower.name}</p>
      <p>Quantity: {quantity}</p>
      <p>Total: ${total.toFixed(2)}</p>
      <button className="pay-button">Pay Now</button>
    </div>
  );
};

export default PaymentPage;
