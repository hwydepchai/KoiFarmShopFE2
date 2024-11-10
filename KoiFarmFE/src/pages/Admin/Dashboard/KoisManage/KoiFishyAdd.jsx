/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function KoiFishyAdd() {
  const [formData, setFormData] = useState({
    categoryId: "",
    price: "",
    quantity: "",
    status: "Active",
    img: null,
  });
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate quantity (ensure it's 10 or above)
    if (parseInt(formData.quantity) < 10) {
      setError("Quantity must be 10 or above.");
      return; // Prevent form submission
    }

    // Clear error if validation passes
    setError("");

    const data = new FormData();
    data.append("categoryId", formData.categoryId);
    data.append("price", formData.price);
    data.append("quantity", formData.quantity);
    data.append("status", formData.status);
    if (formData.img) data.append("img", formData.img);

    try {
      await axios.post("https://localhost:7229/api/KoiFishy", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Koi Fishy added successfully!");
      navigate("/dashboard/KoiFishy"); // Redirect to the list page
    } catch (error) {
      console.error("Error adding new koi fishy:", error);
      alert("Failed to add new Koi Fishy. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Koi Fishy</h2>
      {error && <div className="alert alert-danger">{error}</div>} {/* Show error message */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Category ID</label>
          <input
            type="number"
            className="form-control"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="10" // Ensure the input is 10 or above
          />
        </div>
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            name="img"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Add Koi Fishy
        </button>
      </form>
    </div>
  );
}

export default KoiFishyAdd;
