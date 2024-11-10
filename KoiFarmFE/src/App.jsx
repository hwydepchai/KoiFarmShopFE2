/* eslint-disable no-unused-vars */
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Guest/home";
import LoginPage from "./pages/Guest/login";
import Dashboard from "./pages/Admin/Dashboard";
import KoiList from "./pages/Guest/Koi/KoiList";
import KoiDetails from "./pages/Guest/Koi/KoiDetails";
import Header from "./pages/Guest/Component/Header";
import Consign from "./pages/Guest/Consignment/consignment";
import Feedback from "./pages/Guest/feedback/feedback";
import Blog from "./pages/Guest/blog/blog";
import Cart from "./pages/Customer/cart/Cart";
import PaymentReturn from "./pages/Customer/payment/payment";
import KoiyList from "./pages/Guest/Koiy/KoiyList";
import KoiyDetails from "./pages/Guest/Koiy/KoiyDetails";
import History from "./pages/Customer/cart/history";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/*" element={<HomePage />} />
          <Route path="/koifish" element={<KoiList />} />
          <Route path="/koifish/:id" element={<KoiDetails />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/payment/return" element={<PaymentReturn />} />
          <Route path="/koifishy" element={<KoiyList />} />
          <Route path="/koifishy/:id" element={<KoiyDetails />} />
          <Route path="/consignment" element={<Consign />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
