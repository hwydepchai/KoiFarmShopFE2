/* eslint-disable no-unused-vars */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Guest/home";
import LoginPage from "./pages/Guest/login";
import CartPage from "./pages/Customer/cart";
import Dashboard from "./pages/Admin/Dashboard";
import KoiList from "./pages/Guest/Koi/KoiList";
import KoiDetails from "./pages/Guest/Koi/KoiDetails"; 
import Header from "./pages/Guest/Component/Header";
import Consign from "./pages/Guest/Consignment/consignment";
import Feedback from "./pages/Guest/feedback/feedback";

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
          <Route path="/cart" element={<CartPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/consignment" element={<Consign />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
