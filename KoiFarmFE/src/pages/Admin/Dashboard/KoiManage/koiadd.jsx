/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const countries = [
  "Vietnam",
  "Japan",
  "Thailand",
  "China",
  "South Korea",
  "India",
];
const speciesOptions = [
  "Showa",
  "Asagi",
  "Karashi",
  "Kohaku",
  "Shusui",
  "Sanke",
  "Tancho",
  "Shiro Utsuri",
];
const characterOptions = [
  "Friendly",
  "Curious",
  "Shy",
  "Aggressive",
  "Calm",
  "Playful",
  "Adaptable",
  "Showy",
];

function AddKoi() {
  const [categories, setCategories] = useState([]);
  const [newKoi, setNewKoi] = useState({
    origin: "",
    gender: "Male",
    age: "",
    size: "",
    species: "",
    character: "",
    amountFood: "",
    screeningRate: "",
    type: "",
    status: "Available",
    categoryId: "",
    price: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://localhost:7229/api/Category")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching categories");
        }
        return response.json();
      })
      .then((data) => setCategories(data.$values))
      .catch((error) => setError(error.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewKoi((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    for (const key in newKoi) {
      formData.append(key, newKoi[key]);
    }
    formData.append("Img", image);

    fetch("https://localhost:7229/api/KoiFish", {
      method: "POST",
      headers: {
        accept: "text/plain",
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error adding Koi Fish");
        }
        return response.json();
      })
      .then(() => {
        setLoading(false);
        navigate("/dashboard/koifish");
      })
      .catch(() => {
        setError("Error adding Koi Fish");
        setLoading(false);
      });
  };

  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Add New Koi Fish</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        {/* Basic Information */}
        <div className="col-12">
          <h4 className="text-primary">Basic Information</h4>
        </div>

        {/* Origin */}
        <div className="col-md-4">
          <label htmlFor="origin" className="form-label">
            Origin
          </label>
          <select
            className="form-select"
            id="origin"
            name="origin"
            value={newKoi.origin}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a country
            </option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* Gender */}
        <div className="col-md-4">
          <label htmlFor="gender" className="form-label">
            Gender
          </label>
          <div className="form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="gender"
              name="gender"
              checked={newKoi.gender === "Female"}
              onChange={() =>
                setNewKoi((prev) => ({
                  ...prev,
                  gender: newKoi.gender === "Female" ? "Male" : "Female",
                }))
              }
            />
            <label className="form-check-label" htmlFor="gender">
              {newKoi.gender}
            </label>
          </div>
        </div>

        {/* Age */}
        <div className="col-md-4">
          <label htmlFor="age" className="form-label">
            Age
          </label>
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
        <div className="col-md-4">
          <label htmlFor="size" className="form-label">
            Size (cm)
          </label>
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
        <div className="col-md-4">
          <label htmlFor="species" className="form-label">
            Species
          </label>
          <select
            className="form-select"
            id="species"
            name="species"
            value={newKoi.species}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a species
            </option>
            {speciesOptions.map((species) => (
              <option key={species} value={species}>
                {species}
              </option>
            ))}
          </select>
        </div>

        {/* Character */}
        <div className="col-md-4">
          <label htmlFor="character" className="form-label">
            Character
          </label>
          <select
            className="form-select"
            id="character"
            name="character"
            value={newKoi.character}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a character
            </option>
            {characterOptions.map((character) => (
              <option key={character} value={character}>
                {character}
              </option>
            ))}
          </select>
        </div>

        {/* Amount of Food */}
        <div className="col-md-4">
          <label htmlFor="amountFood" className="form-label">
            Amount of Food
          </label>
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
        <div className="col-md-4">
          <label htmlFor="screeningRate" className="form-label">
            Screening Rate (%)
          </label>
          <input
            type="number"
            className="form-control"
            id="screeningRate"
            name="screeningRate"
            value={newKoi.screeningRate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Type */}
        <div className="col-md-4">
          <label htmlFor="type" className="form-label">
            Type
          </label>
          <select
            className="form-select"
            id="type"
            name="type"
            value={newKoi.type}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a type
            </option>
            <option value="Native">Native</option>
            <option value="F1">F1</option>
            <option value="Imported">Imported</option>
          </select>
        </div>

        {/* Category */}
        <div className="col-md-4">
          <label htmlFor="categoryId" className="form-label">
            Category
          </label>
          <select
            className="form-select"
            id="categoryId"
            name="categoryId"
            value={newKoi.categoryId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.category1}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div className="col-md-4">
          <label htmlFor="price" className="form-label">
            Price (VND)
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={newKoi.price}
            onChange={handleChange}
            required
          />
        </div>

        {/* Image Upload */}
        <div className="col-md-4">
          <label htmlFor="img" className="form-label">
            Image
          </label>
          <input
            type="file"
            className="form-control"
            id="img"
            name="Img"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        {/* Submit Button */}
        <div className="col-12">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding Koi..." : "Add Koi"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddKoi;
