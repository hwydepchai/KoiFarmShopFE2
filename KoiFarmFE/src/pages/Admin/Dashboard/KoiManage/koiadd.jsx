/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./adminKoi.css";

function AddKoi() {
  const [categories, setCategories] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [newKoi, setNewKoi] = useState({
    OriginCertificateId: "",
    Name: "",
    CategoryId: "",
    Origin: "",
    Gender: "Male",
    YearOfBirth: "",
    Size: "",
    Variety: "",
    Character: "",
    Diet: "",
    AmountFood: "",
    ScreeningRate: "",
    Type: "",
    Price: "",
    Img: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

    fetch("https://localhost:7229/api/OriginCertificate")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error fetching certificates");
        }
        return response.json();
      })
      .then((data) => setCertificates(data.$values))
      .catch((error) => setError(error.message));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewKoi((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCertificateChange = (e) => {
    const selectedId = e.target.value;
    setNewKoi((prev) => ({
      ...prev,
      OriginCertificateId: selectedId,
    }));

    // Fetch certificate details and auto-fill fields
    const selectedCertificate = certificates.find(
      (cert) => cert.id === parseInt(selectedId)
    );
    if (selectedCertificate) {
      setNewKoi((prev) => ({
        ...prev,
        Variety: selectedCertificate.variety || "",
        Gender: selectedCertificate.gender || "Male",
        Size: selectedCertificate.size || "",
        YearOfBirth: selectedCertificate.yearOfBirth || "",
      }));
    }
  };

  const handleImageChange = (e) => {
    setNewKoi((prev) => ({
      ...prev,
      Img: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate numeric fields
    if (newKoi.Price < 10000) {
      setError("Price must be greater than 10,000.");
      setLoading(false);
      return;
    }
    if (newKoi.Size <= 0 || newKoi.ScreeningRate <= 0) {
      setError("Size and Screening Rate must be greater than 0.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    for (const key in newKoi) {
      formData.append(key, newKoi[key]);
    }

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

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-CA"); // This will format it as YYYY-MM-DD
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Add New Koi Fish</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        {/* Certificate ID and Auto-filled Fields */}
        <div className="col-12">
          <div className="row g-3">
            {/* Certificate ID */}
            <div className="col-md-4">
              <label htmlFor="OriginCertificateId" className="form-label">
                Origin Certificate
              </label>
              <select
                className="form-select"
                id="OriginCertificateId"
                name="OriginCertificateId"
                value={newKoi.OriginCertificateId}
                onChange={handleCertificateChange}
                required
              >
                <option value="" disabled>
                  Select a certificate
                </option>
                {certificates.map((cert) => (
                  <option key={cert.id} value={cert.id}>
                    {`ID: ${cert.id}, ${formatDate(cert.date)} ${
                      cert.placeOfIssue
                    }`}
                  </option>
                ))}
              </select>
            </div>

            {/* Auto-filled Fields */}
            <div className="col-md-2">
              <label htmlFor="Variety" className="form-label">
                Variety
              </label>
              <input
                type="text"
                className="form-control"
                id="Variety"
                name="Variety"
                value={newKoi.Variety}
                readOnly
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="Gender" className="form-label">
                Gender
              </label>
              <input
                type="text"
                className="form-control"
                id="Gender"
                name="Gender"
                value={newKoi.Gender}
                readOnly
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="Size" className="form-label">
                Size (cm)
              </label>
              <input
                type="number"
                className="form-control"
                id="Size"
                name="Size"
                value={newKoi.Size}
                readOnly
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="YearOfBirth" className="form-label">
                Year of Birth
              </label>
              <input
                type="number"
                className="form-control"
                id="YearOfBirth"
                name="YearOfBirth"
                value={newKoi.YearOfBirth}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Other Fields */}

        {/* Name, Category, Origin, Character, Type */}
        <div className="col-12">
          <div className="row g-3">
            {/* Name */}
            <div className="col-md-4">
              <label htmlFor="Name" className="form-label">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="Name"
                name="Name"
                value={newKoi.Name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Category */}
            <div className="col-md-2">
              <label htmlFor="CategoryId" className="form-label">
                Category
              </label>
              <select
                className="form-select"
                id="CategoryId"
                name="CategoryId"
                value={newKoi.CategoryId}
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
            {/* Origin */}
            <div className="col-md-2">
              <label htmlFor="Origin" className="form-label">
                Origin
              </label>
              <select
                className="form-select"
                id="Origin"
                name="Origin"
                value={newKoi.Origin}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select origin
                </option>
                <option value="Vietnam">Vietnam</option>
                <option value="Japan">Japan</option>
                <option value="Thailand">Thailand</option>
                <option value="China">China</option>
                <option value="South Korea">South Korea</option>
                <option value="India">India</option>
              </select>
            </div>

            {/* Character */}
            <div className="col-md-2">
              <label htmlFor="Character" className="form-label">
                Character
              </label>
              <select
                className="form-select"
                id="Character"
                name="Character"
                value={newKoi.Character}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select character
                </option>
                <option value="Calm">Calm</option>
                <option value="Aggressive">Aggressive</option>
                <option value="Playful">Playful</option>
                <option value="Shy">Shy</option>
                <option value="Curious">Curious</option>
              </select>
            </div>

            {/* Type */}
            <div className="col-md-2">
              <label htmlFor="Type" className="form-label">
                Type
              </label>
              <select
                className="form-select"
                id="Type"
                name="Type"
                value={newKoi.Type}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select type
                </option>
                <option value="F1">F1</option>
                <option value="Imported">Imported</option>
                <option value="Native">Native</option>
              </select>
            </div>
          </div>
        </div>

        {/* Diet, Amount of Food, Screening Rate */}
        <div className="col-12">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="Img" className="form-label">
                Image
              </label>
              <input
                type="file"
                className="form-control"
                id="Img"
                name="Img"
                onChange={handleImageChange}
                required
              />
            </div>
            {/* Diet */}
            <div className="col-md-2">
              <label htmlFor="Diet" className="form-label">
                Diet
              </label>
              <input
                type="text"
                className="form-control"
                id="Diet"
                name="Diet"
                value={newKoi.Diet}
                onChange={handleChange}
                required
              />
            </div>

            {/* Amount of Food */}
            <div className="col-md-2">
              <label htmlFor="AmountFood" className="form-label">
                Amount of Food
              </label>
              <input
                type="number"
                className="form-control"
                id="AmountFood"
                name="AmountFood"
                value={newKoi.AmountFood}
                onChange={handleChange}
                required
              />
            </div>
            {/* Screening Rate */}
            <div className="mb-3 col-md-2">
              <label htmlFor="ScreeningRate" className="form-label">
                Screening Rate
              </label>
              <input
                type="number"
                className="form-control"
                id="ScreeningRate"
                name="ScreeningRate"
                value={newKoi.ScreeningRate}
                onChange={handleChange}
                placeholder="%"
                required
              />
            </div>
            <div className="mb-3 col-md-2">
              <label htmlFor="Price" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="Price"
                name="Price"
                value={newKoi.Price}
                onChange={handleChange}
                placeholder="VND"
                required
              />
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="col-12"></div>

        {/* Submit Button */}
        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Adding Koi..." : "Add Koi"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddKoi;
