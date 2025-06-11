import React, { useState, useEffect } from 'react';
import './StockForm.css';
import * as StockAPI from "../../api/stock";
import { useNavigate,useParams } from 'react-router-dom';

const StockForm = () => {
  const [itemName,setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { stall_id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const data = {
      item_name: itemName,
      price: price,
      quantity: quantity,
    };

    try {
      const response = await StockAPI.createStock(stall_id, file, data);
      console.log("Stock created:", response.data);
      navigate(`/stall/${stall_id}`);
    } catch (err) {
      console.error(err);
      setError("Error creating stock");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate(`/stall/${stall_id}`);
    console.log("Stock creation cancelled");
  };

  return(
    <form onSubmit={handleSubmit} className="stock-form">
      <input
        type='text'
        placeholder='Item Name'
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        required
      />
      <input
        type='number'
        placeholder='Price'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type='file'
        placeholder='Image'
        onChange={(e) => setFile(e.target.files[0])}
        accept='image/*'
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Stock"}
      </button>
      {error && <p className='error'>{error}</p>}
      <button type='button' className='cancel' onClick={onCancel}>Cancel</button>
    </form>
  );
};
export default StockForm;
