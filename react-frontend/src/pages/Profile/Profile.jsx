import React, { useState } from 'react';
import './Profile.css';
import { assets } from '../../assets/assets';
import Dashboard from '../../components/Dashboard/Dashboard';
import StockForm from '../../components/StockForm/StockForm'; // Import StockForm component

const Profile = () => {
  const [showStockForm, setShowStockForm] = useState(false);

  const toggleStockForm = () => {
    setShowStockForm(!showStockForm);
  };

  return (
    <div className="profile-container">
      {/* Profile Section */}
      <div className="profile-section">
        <img src={assets.Avatar} alt="Profile" className="profile-pic" />
        <div className="profile-details">
          <h2>John Doe</h2>
          <p>Email: john.doe@example.com</p>
          <p>Phone: +123456789</p>
          <p>NIC: 123456789V</p>
          <button className="upload-btn">Upload/Change Picture</button>
        </div>
      </div>

      {/* Selling Insights */}
      <div className="selling-insights">
        <div className="insights-card">
          <h3>Total Earnings</h3>
          <p>$500</p>
        </div>
        <div className="insights-card">
          <h3>Completed Orders</h3>
          <p>25</p>
        </div>
      </div>

      {/* Dashboard */}
      <div className="dashboard-container">
        <Dashboard />
      </div>

      {/* Create Stock Button */}
      <div className="create-stock-btn-container">
        <button className="create-stock-btn" onClick={toggleStockForm}>
          Create Stock
        </button>
      </div>

      {/* Stock List */}
      <div className="stock-list">
        <h3>Flower Stocks</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Roses</td>
              <td>$10</td>
              <td>50</td>
              <td>In Stock</td>
              <td>
                <button>Edit</button>
                <button>Remove</button>
              </td>
            </tr>
            <tr>
              <td>Lilies</td>
              <td>$8</td>
              <td>0</td>
              <td>Out of Stock</td>
              <td>
                <button>Edit</button>
                <button>Remove</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Order History */}
      <div className="order-history">
        <h3>Order History</h3>
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Buyer</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ORD123</td>
              <td>Jane Smith</td>
              <td>$50</td>
              <td>2025-01-01</td>
              <td>
                <button>View</button>
                <button>Export</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* StockForm Modal */}
      {showStockForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <StockForm />
            <button className="close-modal-btn" onClick={toggleStockForm}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
