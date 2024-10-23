/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddKoi() {
  const [categories, setCategories] = useState([]); // To store category options
  const [newKoi, setNewKoi] = useState({
    origin: "",
    gender: "",
    age: "",
    size: "",
    species: "",
    character: "",
    amountFood: "",
    screeningRate: "",
    type: "",
    status: "",
    categoryId: "",
    date: new Date().toISOString() // This will hold the selected category ID
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch categories when component mounts
  useEffect(() => {
    fetch("https://localhost:7229/api/Category")
      .then((response) => response.json())
      .then((data) => {
        setCategories(data);
      })
      .catch((error) => {
        setError("Error fetching categories");
      });
  }, []);

  // Handle form inputs change
  const handleChange = (e) => {
    setNewKoi({
      ...newKoi,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("https://localhost:7229/api/KoiFish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newKoi)
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        navigate("/dashboard/koifish"); // Redirect back to koi list after successful submission
      })
      .catch((error) => {
        setError("Error adding Koi Fish");
        setLoading(false);
      });
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Add New Koi Fish</h2>
      <form onSubmit={handleSubmit}>
        {/* Origin */}
        <div className="form-group mb-3">
          <label htmlFor="origin">Origin</label>
          <input
            type="text"
            className="form-control"
            id="origin"
            name="origin"
            value={newKoi.origin}
            onChange={handleChange}
            required
          />
        </div>

        {/* Category */}
        <div className="form-group mb-3">
          <label htmlFor="categoryId">Category</label>
          <select
            className="form-control"
            id="categoryId"
            name="categoryId"
            value={newKoi.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category1}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div className="form-group mb-3">
          <label htmlFor="gender">Gender</label>
          <select
            className="form-control"
            id="gender"
            name="gender"
            value={newKoi.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Age */}
        <div className="form-group mb-3">
          <label htmlFor="age">Age (years)</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={newKoi.age}
            onChange={handleChange}
            required
          />
        </div>

        {/* Size */}
        <div className="form-group mb-3">
          <label htmlFor="size">Size (cm)</label>
          <input
            type="number"
            className="form-control"
            id="size"
            name="size"
            value={newKoi.size}
            onChange={handleChange}
            required
          />
        </div>

        {/* Species */}
        <div className="form-group mb-3">
          <label htmlFor="species">Species</label>
          <input
            type="text"
            className="form-control"
            id="species"
            name="species"
            value={newKoi.species}
            onChange={handleChange}
            required
          />
        </div>

        {/* Character */}
        <div className="form-group mb-3">
          <label htmlFor="character">Character</label>
          <input
            type="text"
            className="form-control"
            id="character"
            name="character"
            value={newKoi.character}
            onChange={handleChange}
            required
          />
        </div>

        {/* Food Amount */}
        <div className="form-group mb-3">
          <label htmlFor="amountFood">Food Amount (kg)</label>
          <input
            type="number"
            className="form-control"
            id="amountFood"
            name="amountFood"
            value={newKoi.amountFood}
            onChange={handleChange}
            required
          />
        </div>

        {/* Screening Rate */}
        <div className="form-group mb-3">
          <label htmlFor="screeningRate">Screening Rate (%)</label>
          <input
            type="number"
            step="0.1"
            className="form-control"
            id="screeningRate"
            name="screeningRate"
            value={newKoi.screeningRate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Type */}
        <div className="form-group mb-3">
          <label htmlFor="type">Type</label>
          <input
            type="text"
            className="form-control"
            id="type"
            name="type"
            value={newKoi.type}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div className="form-group mb-3">
          <label htmlFor="status">Status</label>
          <input
            type="text"
            className="form-control"
            id="status"
            name="status"
            value={newKoi.status}
            onChange={handleChange}
            required
          />
        </div>

        {/* Amount */}
        <div className="form-group mb-3">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            name="amount"
            value={newKoi.amount}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding Koi..." : "Add Koi"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddKoi;
