import React, { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/login", {
        username,
        password,
      });
      if (response.data.status === "success") {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
        setMessage("Login successful");
        window.location.href = "/";
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error logging in. Please check your credentials again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onMouseDown={() => setShowPassword(true)} // Show password on mouse down
              onMouseUp={() => setShowPassword(false)} // Hide password on mouse up
              onMouseLeave={() => setShowPassword(false)} // Hide password if mouse leaves
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && (
        <p className={message === "Login successful" ? "success" : "error"}>
          {message}
        </p>
      )}
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
  );
};

export default Login;
