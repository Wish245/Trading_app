import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, BarElement, ArcElement, LinearScale, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';
import axios from 'axios';

// Register the necessary components for the charts
Chart.register(CategoryScale, BarElement, ArcElement, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    total_earnings: 0,
    completed_orders: 0,
    total_stock: 0,
    in_stock: 0,
    out_of_stock: 0,
  });

  const [monthlyEarnings, setMonthlyEarnings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const userId = localStorage.getItem('userId'); // Retrieve userId from local storage

  // Fetch dashboard data from the backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/dashboard?user_id=${userId}`);
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchMonthlyEarnings = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/monthly-earnings?user_id=${userId}`);
        setMonthlyEarnings(response.data);
      } catch (error) {
        console.error('Error fetching monthly earnings:', error);
      }
    };

    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/notifications?user_id=${userId}`);
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    if (userId) {
      fetchDashboardData();
      fetchMonthlyEarnings();
      fetchNotifications();
    } else {
      console.error('User ID not found in local storage.');
    }
  }, [userId]);

  // Data for the bar chart (Monthly Earnings)
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Monthly Earnings',
        data: monthlyEarnings,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Data for the pie chart (Stock Status)
  const pieData = {
    labels: ['In Stock', 'Out of Stock'],
    datasets: [
      {
        data: [dashboardData.in_stock, dashboardData.out_of_stock],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#e57373'],
      },
    ],
  };

  // Dismiss notification
  const dismissNotification = async (id) => {
    try {
      await axios.post(`http://localhost:8080/api/notifications/dismiss`, { notification_id: id });
      setNotifications(notifications.filter((notification) => notification.id !== id));
    } catch (error) {
      console.error('Error dismissing notification:', error);
    }
  };

  return (
    <div className="dashboard">
      <h2>Merchant Dashboard</h2>

      <div className="charts">
        <div className="chart">
          <h3>Monthly Earnings</h3>
          <Bar data={barData} />
        </div>
        <div className="chart">
          <h3>Stock Status</h3>
          <Pie data={pieData} />
        </div>
      </div>

      <div className="notifications">
        <h3>Notifications</h3>
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id} className={`notification ${notification.type}`}>
                <p>{notification.message}</p>
                <button onClick={() => dismissNotification(notification.id)}>Dismiss</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;