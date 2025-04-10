import axios from "axios";

console.log("Axios Base URL:", process.env.REACT_APP_API_BASE_URL);

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;