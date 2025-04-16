import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { login } from "../../api/auth"; // Import the login function from auth.js
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login form submitted");
    // console.log("Username:", username);
    // console.log("Password:", password);
    setLoading(true);

    try {
      const response = await login(username, password);
      console.log("Login API Response:", response);

      if (response.access_token) {
        toast.success("Login successful!");
        console.log("Login successful. Redirecting to home...");
        localStorage.setItem("token", response.access_token); // <- use the correct field
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } else {
        console.error("Login failed:", response.message);
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error.message);
      toast.error(error.message || "An error occurred during login.");
    } finally {
      setLoading(false);
      console.log("Login process completed");
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
              onMouseDown={() => setShowPassword(true)}
              onMouseUp={() => setShowPassword(false)}
              onMouseLeave={() => setShowPassword(false)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p>
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
      <ToastContainer />
    </div>
  );
};

export default Login;
