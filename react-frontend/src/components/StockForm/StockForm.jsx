import React, { useState } from 'react';
import axios from 'axios';
import './StockForm.css';

const StockForm = () => {
  const [flowerName, setFlowerName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!flowerName || !quantity || !price || !image) {
      setError('All fields are required.');
      return;
    }

    if (quantity <= 0 || price <= 0) {
      setError('Quantity and price must be positive values.');
      return;
    }

    const formData = new FormData();
    formData.append('flowerName', flowerName);
    formData.append('quantity', quantity);
    formData.append('price', price);
    formData.append('image', image);

    try {
      const response = await axios.post('/api/stock', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccessMessage('Flower stock added successfully!');
      // Reset the form after successful submission
      setFlowerName('');
      setQuantity('');
      setPrice('');
      setImage(null);
      setImagePreview(null);
    } catch (error) {
      setError('Failed to add flower stock. Please try again.');
    }
  };

  return (
    <div className="stock-form">
      <h2>Add Flower Stock</h2>
      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="flowerName">Flower Name:</label>
          <input
            type="text"
            id="flowerName"
            value={flowerName}
            onChange={(e) => setFlowerName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity Available:</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">Price per Flower:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Flower Picture:</label>
          <input
            type="file"
            id="image"
            onChange={handleImageChange}
            accept="image/*"
            required
          />
          {imagePreview && <img src={imagePreview} alt="Flower Preview" className="image-preview" />}
        </div>

        <button type="submit">Add Stock</button>
      </form>
    </div>
  );
};

export default StockForm;
