/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AddKoi() {
  const [categories, setCategories] = useState([]);
  const [newKoi, setNewKoi] = useState({
    origin: "",
    gender: "Male", // default gender
    age: "",
    size: "",
    species: "",
    character: "",
    amountFood: "",
    screeningRate: "",
    type: "",
    status: "",
    categoryId: "",
    date: new Date().toISOString(),
    price: "",
    createdDate: new Date().toISOString(),
    modifiedDate: new Date().toISOString(),
    isDeleted: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7229/api/Category")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => setError("Error fetching categories"));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewKoi({
      ...newKoi,
      [name]: type === "checkbox" ? (checked ? "Female" : "Male") : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch("https://localhost:7229/api/KoiFish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newKoi),
    })
      .then((response) => response.json())
      .then(() => {
        setLoading(false);
        navigate("/dashboard/koifish");
      })
      .catch(() => {
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
          />
        </div>

        {/* Gender Toggle Switch */}
        <div className="form-group mb-3">
          <label htmlFor="gender">Gender</label>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="gender"
              name="gender"
              checked={newKoi.gender === "Female"}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="gender">
              {newKoi.gender === "Female" ? "Female" : "Male"}
            </label>
          </div>
        </div>

        {/* Age */}
        <div className="form-group mb-3">
          <label htmlFor="age">Age</label>
          <input
            type="number"
            className="form-control"
            id="age"
            name="age"
            value={newKoi.age}
            onChange={handleChange}
          />
        </div>

        {/* Size */}
        <div className="form-group mb-3">
          <label htmlFor="size">Size</label>
          <input
            type="text"
            className="form-control"
            id="size"
            name="size"
            value={newKoi.size}
            onChange={handleChange}
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
          />
        </div>

        {/* Amount of Food */}
        <div className="form-group mb-3">
          <label htmlFor="amountFood">Amount of Food</label>
          <input
            type="number"
            className="form-control"
            id="amountFood"
            name="amountFood"
            value={newKoi.amountFood}
            onChange={handleChange}
          />
        </div>

        {/* Screening Rate */}
        <div className="form-group mb-3">
          <label htmlFor="screeningRate">Screening Rate</label>
          <input
            type="text"
            className="form-control"
            id="screeningRate"
            name="screeningRate"
            value={newKoi.screeningRate}
            onChange={handleChange}
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
          />
        </div>

        {/* Category (Dropdown) */}
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

        {/* Price */}
        <div className="form-group mb-3">
          <label htmlFor="price">Price</label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={newKoi.price}
            onChange={handleChange}
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
