// src/utils/axiosInstance.js (or wherever you organize utilities)

import axios from "axios";

// Log to verify the base URL is loaded
console.log("Axios Base URL:", process.env.REACT_APP_API_BASE_URL);

// Create the axios instance
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Optional: Add a request interceptor to include auth token
axiosInstance.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token"); // Adjust if using sessionStorage or cookies
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// Optional: Add a response interceptor for error handling/logging
axiosInstance.interceptors.response.use(
    response => response,
    error => {
        console.error("API error:", error.response || error.message);
        return Promise.reject(error);
    }
);

export default axiosInstance;
