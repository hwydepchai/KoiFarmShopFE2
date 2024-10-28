/* eslint-disable no-unused-vars */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Guest/home";
import LoginPage from "./pages/Guest/login";
import RegisterPage from "./pages/Guest/register";
import CartPage from "./pages/Customer/cart";
import Dashboard from "./pages/Admin/Dashboard";
import KoiList from "./pages/Guest/Koi/KoiList";
import KoiDetails from "./pages/Guest/Koi/KoiDetails";
import Header from "./pages/Guest/Component/Header";

function App() {
  return (
    <>
      <Router>
        
      <Header />
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/koifish/*" element={<KoiList />} />
          <Route path="/koifish/:id" element={<KoiDetails />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
