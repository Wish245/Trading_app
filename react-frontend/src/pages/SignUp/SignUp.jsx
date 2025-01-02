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

  const handlesignup = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post("http://localhost:8080/api/signup", {
            username,
            email,
            phone,
            nationalID,
            password,
        });
        console.log(response.data);
        if (response.data.status === "success") {
            setMessage("Signup successful! Please log in.");
        } else {
            setMessage(response.data.message);
        }
        } catch (error) {
        setMessage("Error signing up.Please try again.");
        }
    };
    return (
      <div className="signup-container">
        <h2>Sign Up</h2>
        <form>
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
          <button type="submit">Sign Up</button>
        </form>
        {message && <p>{message}</p>}
        <p>
            Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    );
};

export default SignUp;
