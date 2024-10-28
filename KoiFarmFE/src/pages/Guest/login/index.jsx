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
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const api = "https://localhost:7229/api/Auth/login";

    try {
      const response = await axios.post(api, loginData);
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/home");
    } catch (error) {
      console.error("An error occurred:", error.message);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const api = "https://localhost:7229/api/Auth/register";

    try {
      const response = await axios.post(api, registerData);
      console.log(response.data);
      alert("Registration successful!");
      navigate("/login");
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 login-page">
      <div className="border rounded p-4 shadow login-container">
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
              />
            </div>
            <div className="form-group mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={loginData.password}
                minLength='8'
                onChange={handleLoginChange}
                required
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
              />
            </div>
            <div className="form-group mb-3">
              <label>Fullname</label>
              <input
                type="text"
                name="fullname"
                className="form-control"
                value={registerData.fullname}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                className="form-control"
                value={registerData.phone}
                onChange={handleRegisterChange}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={registerData.password}
                onChange={handleRegisterChange}
                required
              />
            </div>
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
