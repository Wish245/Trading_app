import React, { useState } from "react";
import { signup } from "../../api/auth"; // Import the signup function from auth.js
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import "./SignUp.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalID, setNationalID] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log("Signup form submitted");
    console.log({
      username,
      email,
      phone,
      national_id: nationalID, // Ensure this matches the backend field name
      password,
    });
    setIsLoading(true);

    try {
      const response = await signup(username, email, phone, nationalID, password);
      console.log("Signup API Response:", response);

      if (response.status === "success") {
        toast.success("Signup successful! Please log in.");
        console.log("Signup successful. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/login"; // Redirect to login page
        }, 2000);
      } else {
        console.error("Signup failed:", response.message);
        toast.error(response.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error.message);
      toast.error(error.message || "An error occurred during signup.");
    } finally {
      setIsLoading(false);
      console.log("Signup process completed");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <p>
        Have an account? <a href="/login">Login</a>
      </p>
      <ToastContainer />
    </div>
  );
};

export default SignUp;
