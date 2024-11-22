/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function KoiFishyAdd() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male", // Default gender set to Male
    size: "",
    yearOfBirth: "",
    variety: "",
    origin: "",
    diet: "", // Add diet here
    character: "",
    categoryId: "",
    price: "",
    quantity: "",
    status: "Active",
    img: null,
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7229/api/Category");
        setCategories(response.data.$values);
      } catch (error) {
        console.error("Error fetching categories:", error);
        alert("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    let updatedValue = value; // Create a new variable to hold the modified value

    if (name === "name") {
      // Capitalize the first letter of name
      updatedValue = value.charAt(0).toUpperCase() + value.slice(1);
    }

    setFormData({
      ...formData,
      [name]: type === "file" ? files[0] : updatedValue, // Use updatedValue
    });

    if (type === "file" && files.length > 0) {
      const file = files[0];
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Size (ensure it's > 0 and < 100)
    if (parseInt(formData.size) <= 0 || parseInt(formData.size) >= 100) {
      setError("Size must be between 0 and 100.");
      return;
    }

    // Validate Year of Birth (ensure it's after 2000)
    const currentYear = new Date().getFullYear();
    if (
      parseInt(formData.yearOfBirth) < 2000 ||
      parseInt(formData.yearOfBirth) > currentYear
    ) {
      setError("Year of birth must be after 2000 and before the current year.");
      return;
    }

    // Validate Quantity (ensure it's >= 10)
    if (parseInt(formData.quantity) < 10) {
      setError("Quantity must be 10 or above.");
      return;
    }

    // Validate Price (ensure it's between 10,000 and 100,000,000)
    if (
      parseInt(formData.price) < 10000 ||
      parseInt(formData.price) > 100000000
    ) {
      setError("Price must be between 10,000 and 100,000,000.");
      return;
    }

    // Clear errors if validation passes
    setError("");

    const data = new FormData();
    data.append("name", formData.name);
    data.append("gender", formData.gender);
    data.append("size", formData.size);
    data.append("yearOfBirth", formData.yearOfBirth);
    data.append("variety", formData.variety);
    data.append("origin", formData.origin);
    data.append("diet", formData.diet); // Add diet to form data
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
      navigate("/dashboard/KoiFishy");
    } catch (error) {
      console.error("Error adding new koi fishy:", error);
      alert("Failed to add new Koi Fishy. Please try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add New Koi Fishy</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
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

          {/* Diet Dropdown */}
          <div className="form-group col-md-6">
            <label>Diet</label>
            <select
              className="form-control"
              name="diet"
              value={formData.diet}
              onChange={handleChange}
              required
            >
              <option value="">Select a diet</option>
              <option value="Pellets">Pellets</option>
              <option value="Flakes">Flakes</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Fruits">Fruits</option>
              <option value="Shrimp">Shrimp</option>
              <option value="Worms">Worms</option>
              <option value="Insects">Insects</option>
              <option value="Cheerios">Cheerios</option>
              <option value="Rice">Rice</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <label>Size (cm)</label>
              <input
                type="number"
                className="form-control"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
                min="1"
                max="100"
                placeholder="Enter size in cm"
              />
            </div>

            <div className="form-group">
              <label>Year of Birth</label>
              <input
                type="number"
                className="form-control"
                name="yearOfBirth"
                value={formData.yearOfBirth}
                onChange={handleChange}
                required
                min="2000"
                max={new Date().getFullYear()}
                placeholder="Enter year of birth"
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
                min="10000"
                max="100000000"
                placeholder="Enter price (10,000 - 100,000,000)"
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
                min="10"
                placeholder="At least 10 fishes"
              />
            </div>
          </div>

          <div className="col-md-6">
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
                <option value="Sanke">Sanke</option>
                <option value="Showa">Showa</option>
                <option value="Utsuri">Utsuri</option>
                <option value="Shiro Utsuri">Shiro Utsuri</option>
              </select>
            </div>

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
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Image</label>
              <input
                type="file"
                className="form-control-file"
                name="img"
                onChange={handleChange}
              />
              {imagePreview && (
                <img src={imagePreview} alt="Preview" width="100" />
              )}
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary">
          Add Koi Fishy
        </button>
      </form>
    </div>
  );
}

export default KoiFishyAdd;
