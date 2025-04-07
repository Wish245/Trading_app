import React, { useState } from "react";
import axios from "axios"; // import axios
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/login", {
        username,
        password,
      });
      console.log(response.data);
      if (response.data.status === "success") {
        // Store userId in local storage
        localStorage.setItem("userId", response.data.userId);

        setMessage("Login successful");
        window.location.href = "/"; // redirect to home page
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error logging in. Please check your credentials again.");
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
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
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