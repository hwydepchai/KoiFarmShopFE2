/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function KoiFishyAdd() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    size: "",
    yearOfBirth: "",
    variety: "",
    origin: "",
    diet: "",
    character: "",
    categoryId: "",
    price: "",
    quantity: "",
    status: "Active",
    img: null,
  });
  const [categories, setCategories] = useState([]); // State to store categories
  const [error, setError] = useState(""); // State for error message
  const [imagePreview, setImagePreview] = useState(""); // State for image preview
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

    // If the input is an image, update the preview
    if (type === "file" && files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
    }
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
    data.append("name", formData.name);
    data.append("gender", formData.gender);
    data.append("size", formData.size);
    data.append("yearOfBirth", formData.yearOfBirth);
    data.append("variety", formData.variety);
    data.append("origin", formData.origin);
    data.append("diet", formData.diet);
    data.append("character", formData.character);
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
      {error && <div className="alert alert-danger">{error}</div>}{" "}
      {/* Show error message */}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Name Input */}
        <div className="row">
          <div className="form-group col-md-4">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter Koi Fishy name"
            />
          </div>

          {/* Gender Radio Buttons */}
          <div className="form-group col-md-2 d-flex flex-column">
            <br />
            <label className="mr-3">
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === "Male"}
                onChange={handleChange}
              />{" "}
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === "Female"}
                onChange={handleChange}
              />{" "}
              Female
            </label>
          </div>
        </div>

        <div className="row">
          {/* Left Column (Number Inputs) */}
          <div className="col-md-6">
            {/* Size Input */}
            <div className="form-group">
              <label>Size (cm)</label>
              <input
                type="number"
                className="form-control"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                placeholder="Enter size in cm"
              />
            </div>

            {/* Year of Birth Input */}
            <div className="form-group">
              <label>Year of Birth</label>
              <input
                type="number"
                className="form-control"
                name="yearOfBirth"
                value={formData.yearOfBirth}
                onChange={handleChange}
                required
                placeholder="Enter year of birth"
              />
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
                min="10000"
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
                min="10"
                placeholder="At least 10 fishes"
              />
            </div>
          </div>

          {/* Right Column (Dropdown Inputs) */}
          <div className="col-md-6">
            {/* Variety Dropdown */}
            <div className="form-group">
              <label>Variety</label>
              <select
                className="form-control"
                name="variety"
                value={formData.variety}
                onChange={handleChange}
                required
              >
                <option value="">Select a variety</option>
                <option value="Kohaku">Kohaku</option>
                <option value="Showa Sanke">Showa Sanke</option>
                <option value="Utsuri">Utsuri</option>
                <option value="Asagi">Asagi</option>
                <option value="Shusui">Shusui</option>
                <option value="Ginrin">Ginrin</option>
                <option value="Ogon">Ogon</option>
                <option value="Tancho">Tancho</option>
              </select>
            </div>

            {/* Origin Dropdown */}
            <div className="form-group">
              <label>Origin</label>
              <select
                className="form-control"
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                required
              >
                <option value="">Select an origin</option>
                <option value="Vietnam">Vietnam</option>
                <option value="Japan">Japan</option>
                <option value="Thailand">Thailand</option>
                <option value="China">China</option>
                <option value="South Korea">South Korea</option>
                <option value="India">India</option>
              </select>
            </div>

            {/* Character Dropdown */}
            <div className="form-group">
              <label>Character</label>
              <select
                className="form-control"
                name="character"
                value={formData.character}
                onChange={handleChange}
                required
              >
                <option value="">Select a character</option>
                <option value="Calm">Calm</option>
                <option value="Friendly">Friendly</option>
                <option value="Aggressive">Aggressive</option>
                <option value="Playful">Playful</option>
                <option value="Shy">Shy</option>
                <option value="Curious">Curious</option>
              </select>
            </div>

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
          </div>
        </div>

        {/* Image Input and Preview */}
        <div className="form-group">
          <label>Image</label>
          <input
            type="file"
            className="form-control"
            name="img"
            onChange={handleChange}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Image Preview"
              className="mt-3"
              style={{ maxHeight: "200px" }}
            />
          )}
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Add Koi Fishy
        </button>
      </form>
    </div>
  );
}

export default KoiFishyAdd;
