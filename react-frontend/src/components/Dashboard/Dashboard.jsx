import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import { Chart, CategoryScale, BarElement, ArcElement, LinearScale, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';

// Register the necessary components for the charts
Chart.register(CategoryScale, BarElement, ArcElement, LinearScale, Tooltip, Legend);

const Dashboard = () => {
  // Example data for charts
  const barData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'Monthly Earnings',
        data: [1200, 1500, 1800, 2200, 2000, 2500],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['In Stock', 'Out of Stock'],
    datasets: [
      {
        data: [75, 25], // Example: 75% in stock, 25% out of stock
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#66bb6a', '#e57373'],
      },
    ],
  };

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Roses are low on stock!', type: 'warning' },
    { id: 2, message: 'Tulips are out of stock!', type: 'error' },
  ]);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter((notification) => notification.id !== id));
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
