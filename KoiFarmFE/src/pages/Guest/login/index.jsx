/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./login.css";

function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const togglePage = () => {
    setIsLogin(!isLogin);
  };

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
    phone: "",
    birthday: "",
    gender: "", // Track selected gender
  });

  const [formError, setFormError] = useState(""); // New state for form error

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGenderChange = (e) => {
    setRegisterData((prevData) => ({
      ...prevData,
      gender: e.target.value,
    }));
    setFormError(""); // Reset form error on gender change
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const api = "https://localhost:7229/api/Auth/login";

    try {
      const response = await axios.post(api, loginData);
      const { data: data, roleId, userId, message } = response.data;

      // Save token and user info in localStorage
      localStorage.setItem("token", data);
      localStorage.setItem(
        "user",
        JSON.stringify({
          roleId,
          userId,
        })
      );

      // Navigate based on roleId or show a success message
      if (roleId === 1) {
        navigate("/dashboard");
      } else {
        alert(message || "Logged in successfully");
        navigate("/home");
      }
      navigate(0); // Refresh
    } catch (error) {
      console.error("An error occurred:", error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  const formatFullname = (fullname) => {
    return fullname
      .split(" ") // Split by spaces
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitalize first letter and lower the rest
      .join(" "); // Join back with spaces
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Check if gender is selected
    if (!registerData.gender) {
      setFormError("Please select a gender.");
      return;
    }

    // Format fullname before sending to API
    const formattedFullname = formatFullname(registerData.fullname);

    const api = "https://localhost:7229/api/Auth/register";

    try {
      const response = await axios.post(api, {
        ...registerData,
        fullname: formattedFullname, // Send the formatted fullname
      });
      alert("Registration successful!");
      navigate(0);
    } catch (error) {
      console.error("Registration error:", error.message);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login-page">
      <div className="border rounded p-4 login-container">
        <h2 className="text-center mb-4">{isLogin ? "Login" : "Register"}</h2>

        {isLogin ? (
          <form onSubmit={handleLoginSubmit} className="login-form">
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={loginData.email}
                onChange={handleLoginChange}
                required
                placeholder="Email"
              />
            </div>
            <div className="form-group mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={loginData.password}
                pattern="^(?=.*[A-Z]).{8,}$"
                onChange={handleLoginChange}
                required
                placeholder="Password"
                title="Password format is incorrect."
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Login
            </button>
            <div className="mt-3 text-center">
              <Link to="#">Forgot password?</Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="register-form">
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                name="email"
                className="form-control"
                value={registerData.email}
                onChange={handleRegisterChange}
                required
                placeholder="Email"
              />
            </div>
            {/* Fullname field */}
            <div className="form-group mb-3">
              <label>Fullname</label>
              <input
                type="text"
                name="fullname"
                className="form-control"
                value={registerData.fullname}
                onChange={handleRegisterChange}
                required
                pattern="^[A-Za-z]+(?: [A-Za-z]+)*$" // Allow only letters and spaces
                title="Full name should only contain letters and spaces, and the first letter of each word must be capitalized."
                placeholder="Full name"
              />
            </div>

            <div className="d-flex justify-content-center">
              {/* Phone field */}
              <div className="form-group mb-3 me-3">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  required
                  pattern="^0[0-9]{9}$" // Phone number must start with 0 and be 10 digits long
                  title="Phone number must start with 0 and contain exactly 10 digits."
                />
              </div>

              {/* Birthday field */}
              <div className="form-group mb-3 ms-1">
                <label>Birthday</label>
                <input
                  type="date"
                  name="birthday"
                  className="form-control"
                  value={registerData.birthday}
                  onChange={handleRegisterChange}
                  required
                />
              </div>
            </div>

            {/* Gender radio buttons */}
            <div className="form-group mb-3 d-flex align-items-center">
              <div className="d-flex">
                <div className="form-check me-3">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    className="form-check-input"
                    checked={registerData.gender === "male"}
                    onChange={handleGenderChange}
                    required
                  />
                  <label className="form-check-label">Male</label>
                </div>
                <div className="form-check me-3">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    className="form-check-input"
                    checked={registerData.gender === "female"}
                    onChange={handleGenderChange}
                    required
                  />
                  <label className="form-check-label">Female</label>
                </div>
                <div className="form-check">
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    className="form-check-input"
                    checked={registerData.gender === "other"}
                    onChange={handleGenderChange}
                    required
                  />
                  <label className="form-check-label">Other</label>
                </div>
              </div>
            </div>
            {formError && <div className="text-danger">{formError}</div>}

            {/* Password field */}
            <div className="form-group mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
                pattern="^(?=.*[A-Z]).{8,}$" // At least 8 characters and 1 uppercase letter
                title="Password must contain at least 8 characters, including one uppercase letter."
              />
            </div>

            {/* Confirm Password field */}
            <div className="form-group mb-3">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="form-control"
                value={registerData.confirmPassword}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Register
            </button>
          </form>
        )}

        <button onClick={togglePage} className="btn btn-link mt-3 w-100 toggle">
          {isLogin
            ? "Don't have an account? Register here"
            : "Already have an account? Login here"}
        </button>
      </div>
    </div>
  );
}

export default LoginPage;
