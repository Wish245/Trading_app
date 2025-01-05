import React, { useState, useEffect } from 'react';
import './Profile.css';
import { assets } from '../../assets/assets';
import Dashboard from '../../components/Dashboard/Dashboard';
import StockForm from '../../components/StockForm/StockForm';
import axios from 'axios';

const Profile = () => {
  const [showStockForm, setShowStockForm] = useState(false);
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    phone: '',
    nationalID: '',
    profile_picture_path: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

  // Fetch profile data from the backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`/api/profile?user_id=${userId}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    if (userId) {
      fetchProfileData();
    } else {
      console.error('User ID not found in local storage.');
    }
  }, [userId]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/profile/update', {
        user_id: userId,
        username: profileData.username,
        email: profileData.email,
        phone: profileData.phone,
        nationalID: profileData.nationalID,
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  return (
    <div className="profile-container">
      {/* Profile Section */}
      <div className="profile-section">
        <img src={assets.Avatar} alt="Profile" className="profile-pic" />
        <div className="profile-details">
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <input
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                placeholder="Username"
              />
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleInputChange}
                placeholder="Email"
              />
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
              />
              <input
                type="text"
                name="nationalID"
                value={profileData.nationalID}
                onChange={handleInputChange}
                placeholder="National ID"
              />
              <button type="submit">Save</button>
              <button type="button" onClick={toggleEditMode}>
                Cancel
              </button>
            </form>
          ) : (
            <>
              <h2>{profileData.username}</h2>
              <p>Email: {profileData.email}</p>
              <p>Phone: {profileData.phone}</p>
              <p>NIC: {profileData.nationalID}</p>
              <button className="upload-btn" onClick={toggleEditMode}>
                Edit Profile
              </button>
            </>
          )}
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
        <Dashboard userId={userId} />
      </div>

      {/* Create Stock Button */}
      <div className="create-stock-btn-container">
        <button className="create-stock-btn" onClick={() => setShowStockForm(true)}>
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
            <button className="close-modal-btn" onClick={() => setShowStockForm(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;