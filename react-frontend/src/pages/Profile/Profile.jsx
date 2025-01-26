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
  const [dashboardData, setDashboardData] = useState({
    totalEarnings: 0,
    completedOrders: 0,
    totalStock: 0,
    inStock: 0,
    outOfStock: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

  // Fetch profile data from the backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/profile?user_id=${userId}`);
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/dashboard?user_id=${userId}`);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (userId) {
      fetchProfileData();
      fetchDashboardData();
    } else {
      console.error('User ID not found in local storage.');
    }
  }, [userId]);

  // Handle profile update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/profile/update', {
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
        <img 
          src={profileData.profile_picture_path ? profileData.profile_picture_path : assets.Avatar} 
          alt="Profile" 
          className="profile-pic" 
        />
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
          <p>${dashboardData.totalEarnings}</p>
        </div>
        <div className="insights-card">
          <h3>Completed Orders</h3>
          <p>{dashboardData.completedOrders}</p>
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
            {/* Fetch and display real stock data here */}
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
            {/* Fetch and display real order history data here */}
          </tbody>
        </table>
      </div>

      {/* StockForm Modal */}
      {showStockForm && (
        <div className="modal-overlay" onClick={() => setShowStockForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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