import React, { useState } from "react";
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handlesignup = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setMessage(""); // Clear previous messages

    try {
      const response = await axios.post("http://localhost:8000/signup", {
        username,
        email,
        phone,
        national_id: nationalID,
        password,
      });
      console.log(response.data);

      if (response.data.status === "success") {
        setMessage("Signup successful! Please log in.");
        window.location.href = "/login"; // Redirect to login page
      } else {
        setMessage(response.data.message); // Display error message from backend
      }
    } catch (error) {
      setMessage("Error signing up. Please try again."); // Handle request failure
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handlesignup}>
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
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone:</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label>National ID:</label>
          <input
            type="text"
            value={nationalID}
            onChange={(e) => setNationalID(e.target.value)}
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      {message && <p>{message}</p>}
      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default SignUp;
