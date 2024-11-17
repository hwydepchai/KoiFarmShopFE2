/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./origin.css";

const CertificateManager = () => {
  const [formData, setFormData] = useState({
    variety: "",
    gender: "Male",
    size: "",
    yearOfBirth: "",
    date: "",
    placeOfIssue: "",
    image: null,
  });
  const [editData, setEditData] = useState({
    variety: "",
    gender: "Male",
    size: "",
    yearOfBirth: "",
    date: "",
    placeOfIssue: "",
    image: null,
  });
  const [certificates, setCertificates] = useState([]);
  const [images, setImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch all certificates and images on component mount
  useEffect(() => {
    fetchCertificates();
    fetchImages();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get(
        "https://localhost:7229/api/OriginCertificate"
      );
      setCertificates(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const fetchImages = async () => {
    try {
      const response = await axios.get("https://localhost:7229/api/Image");
      setImages(response.data.$values || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleEditClick = (certificate) => {
    const imageUrl = getImageUrl(certificate.id); // Fetch the existing image URL
    setEditingId(certificate.id);
    setEditData({
      variety: certificate.variety,
      gender: certificate.gender,
      size: certificate.size,
      yearOfBirth: certificate.yearOfBirth,
      date: certificate.date,
      placeOfIssue: certificate.placeOfIssue,
      image: null, // New image input
      existingImage: imageUrl, // Existing image URL
    });
    setPreviewImage(imageUrl); // Initialize preview with the old image
    setShowModal(true);
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const handleCreateImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditData({ ...editData, image: file });
      const reader = new FileReader();
      reader.onload = () => setPreviewImage(reader.result); // Preview the new image
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("variety", editData.variety);
    data.append("gender", editData.gender);
    data.append("size", parseFloat(editData.size));
    data.append("yearOfBirth", parseInt(editData.yearOfBirth));
    data.append("date", editData.date);
    data.append("placeOfIssue", editData.placeOfIssue);

    if (editData.image) {
      data.append("Img", editData.image); // Append only if there's a new file
    }

    try {
      await axios.put(
        `https://localhost:7229/api/OriginCertificate/${editingId}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Certificate updated successfully!");
      setShowModal(false);
      fetchCertificates();
    } catch (error) {
      console.error("Error updating certificate:", error);
      setMessage("Failed to update certificate.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.image) {
      setMessage("Image is required.");
      return;
    }

    // Prepare FormData to send image and other data
    const data = new FormData();
    data.append("variety", formData.variety);
    data.append("gender", formData.gender);
    data.append("size", parseFloat(formData.size));
    data.append("yearOfBirth", parseInt(formData.yearOfBirth));
    data.append("date", formData.date);
    data.append("placeOfIssue", formData.placeOfIssue);
    data.append("Img", formData.image); // Append the image with the correct name

    try {
      const response = await axios.post(
        "https://localhost:7229/api/OriginCertificate",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setMessage("Certificate created successfully!");
      setFormData({
        variety: "",
        gender: "Male",
        size: "",
        yearOfBirth: "",
        date: "",
        placeOfIssue: "",
        image: null,
      });
      fetchCertificates();
    } catch (error) {
      console.error("Error creating certificate:", error);
      setMessage("Failed to create certificate.");
    }
  };

  // Fetch the image URL for the certificate's image ID
  const getImageUrl = (certificateId) => {
    const relatedImages = images.filter(
      (image) => image.originCertificateId === certificateId
    );
    return relatedImages.length > 0 ? relatedImages[0].urlPath : null;
  };

  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-CA"); // This will format it as YYYY-MM-DD
  };

  return (
    <div className="container mt-5">
      <h2>Create Certificate for Koi Fish</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="d-flex gap-3">
          <div className="form-group">
            <label>Variety</label>
            <select
              className="form-select"
              name="variety"
              value={formData.variety}
              onChange={handleCreateInputChange}
              required
            >
              <option value="" disabled>
                Select variety
              </option>
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

          <div className="form-group">
            <label>Gender</label>
            <div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="male"
                  name="gender"
                  value="Male"
                  checked={formData.gender === "Male"}
                  onChange={handleCreateInputChange}
                />
                <label className="form-check-label" htmlFor="male">
                  Male
                </label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  id="female"
                  name="gender"
                  value="Female"
                  onChange={handleCreateInputChange}
                />
                <label className="form-check-label" htmlFor="female">
                  Female
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex gap-3">
          <div className="form-group">
            <label>Size (cm)</label>
            <input
              type="number"
              className="form-control"
              name="size"
              value={formData.size}
              onChange={handleCreateInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Year of Birth</label>
            <input
              type="number"
              className="form-control"
              name="yearOfBirth"
              value={formData.yearOfBirth}
              onChange={handleCreateInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleCreateInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Place of Issue</label>
            <input
              type="text"
              className="form-control"
              name="placeOfIssue"
              value={formData.placeOfIssue}
              onChange={handleCreateInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Image</label>
            <input
              type="file"
              className="form-control"
              name="image"
              accept="image/*"
              onChange={handleCreateImageChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Create Certificate
        </button>
      </form>

      <h2>Certificates List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Variety</th>
            <th>Gender</th>
            <th>Size (cm)</th>
            <th>Year of Birth</th>
            <th>Date</th>
            <th>Place of Issue</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate) => (
            <tr key={certificate.id}>
              <td>{certificate.variety}</td>
              <td>{certificate.gender}</td>
              <td>{certificate.size}</td>
              <td>{certificate.yearOfBirth}</td>
              <td>{formatDate(certificate.date)}</td>
              <td>{certificate.placeOfIssue}</td>
              <td>
                <img
                  src={getImageUrl(certificate.id)}
                  alt="Certificate Image"
                  width="100"
                />
              </td>
              <td>
                <button
                  className="btn btn-warning"
                  onClick={() => handleEditClick(certificate)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Background Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal show" style={{ display: "block" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Certificate</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <form onSubmit={handleUpdateSubmit}>
                    <div className="form-group">
                      <label>Variety</label>
                      <select
                        className="form-select"
                        name="variety"
                        value={editData.variety}
                        onChange={handleEditInputChange}
                      >
                        <option value="Kohaku">Kohaku</option>
                        <option value="Sanke">Sanke</option>
                        <option value="Showa">Showa</option>
                        <option value="Utsurimono">Utsurimono</option>
                        <option value="Asagi">Asagi</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Gender</label>
                      <div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="male"
                            name="gender"
                            value="Male"
                            checked={editData.gender === "Male"}
                            onChange={handleEditInputChange}
                          />
                          <label className="form-check-label" htmlFor="male">
                            Male
                          </label>
                        </div>
                        <div className="form-check form-check-inline">
                          <input
                            className="form-check-input"
                            type="radio"
                            id="female"
                            name="gender"
                            value="Female"
                            onChange={handleEditInputChange}
                          />
                          <label className="form-check-label" htmlFor="female">
                            Female
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Size (cm)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="size"
                        value={editData.size}
                        onChange={handleEditInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Year of Birth</label>
                      <input
                        type="number"
                        className="form-control"
                        name="yearOfBirth"
                        value={editData.yearOfBirth}
                        onChange={handleEditInputChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        value={editData.date}
                        onChange={handleEditInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label>Place of Issue</label>
                      <input
                        type="text"
                        className="form-control"
                        name="placeOfIssue"
                        value={editData.placeOfIssue}
                        onChange={handleEditInputChange}
                      />
                    </div>

                    <div className="form-group mt-2 text-center">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt="Certificate Preview"
                          width="450"
                          className="mb-2"
                        />
                      ) : (
                        <p>No image available</p>
                      )}
                      <input
                        type="file"
                        className="form-control mt-3"
                        name="image"
                        accept="image/*"
                        onChange={handleEditImageChange}
                      />
                    </div>

                    <button type="submit" className="btn btn-primary mt-3">
                      Update Certificate
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default CertificateManager;
