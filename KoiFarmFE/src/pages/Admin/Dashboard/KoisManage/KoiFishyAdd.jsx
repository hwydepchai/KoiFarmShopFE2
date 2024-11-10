/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
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
  const [categories, setCategories] = useState([]); // State to store categories
  const [error, setError] = useState(""); // State for error message
  const navigate = useNavigate();

  // Fetch categories from the API when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7229/api/Category");
        setCategories(response.data.$values); // Set categories from API response
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

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

    // Validate price (ensure it's at least 10,000)
    if (parseInt(formData.price) < 10000) {
      setError("Price must be at least 10,000.");
      return;
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
        {/* Category Dropdown */}
        <div className="form-group">
          <label>Category</label>
          <select
            className="form-control"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category1}
              </option>
            ))}
          </select>
        </div>

        {/* Price Input */}
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="10000" // Ensure the price is at least 10000
            placeholder="Enter price (at least 10,000)"
          />
        </div>

        {/* Quantity Input */}
        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            min="10" // Ensure the quantity is at least 10
            placeholder="At least 10 fishes"
          />
        </div>

        {/* Image Input */}
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
