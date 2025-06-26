import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as StockAPI from '../../api/stock';
import './Stock.css';  // You can style as needed

const Stock = () => {
  const { stock_id } = useParams();
  const navigate = useNavigate();
  const [stock, setStock] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await StockAPI.getStockById(stock_id);
        setStock(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load stock details.");
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [stock_id]);

  const handleOrder = () => {
    // Navigate to order page or trigger order logic
    navigate(`/order-form/${stock_id}`);  // Adjust as needed
  };

  const handleCut = () => {
    navigate('/market');
  };

  if (loading) return <p>Loading stock details...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="stock-details">
      <h2>{`${stock.item_name} #${stock.stock_id}`}</h2>
      {stock.stock_img_path && (
        <img 
          src={`http://localhost:8000/static/${stock.stock_img_path}`} 
          alt={stock.item_name}
          className="stock-image"
        />
      )}
      <p><strong>Price:</strong> ${stock.price}</p>
      <p><strong>Quantity:</strong> {stock.quantity}</p>
      <button onClick={handleOrder}>Order</button>
      <button onClick={handleCut}>Close</button>
    </div>
  );
};

export default Stock;
