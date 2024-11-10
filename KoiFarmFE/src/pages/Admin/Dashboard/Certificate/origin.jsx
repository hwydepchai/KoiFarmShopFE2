import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const CertificateManager = () => {
  const [formData, setFormData] = useState({
    koiId: "",
    orderId: "",
    startTime: "",
    endTime: "",
  });
  const [certificates, setCertificates] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch all certificates on component mount
  useEffect(() => {
    fetchCertificates();
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://localhost:7229/api/OriginCertificate",
        {
          koiId: parseInt(formData.koiId),
          orderId: parseInt(formData.orderId),
          startTime: formData.startTime,
          endTime: formData.endTime,
        }
      );
      setMessage("Certificate created successfully!");
      setFormData({ koiId: "", orderId: "", startTime: "", endTime: "" });
      fetchCertificates();
    } catch (error) {
      console.error("Error creating certificate:", error);
      setMessage("Failed to create certificate.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Certificate for Koi Fish</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <label htmlFor="koiId" className="form-label">
            Koi ID
          </label>
          <input
            type="number"
            className="form-control"
            id="koiId"
            name="koiId"
            value={formData.koiId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="orderId" className="form-label">
            Order ID
          </label>
          <input
            type="number"
            className="form-control"
            id="orderId"
            name="orderId"
            value={formData.orderId}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="startTime" className="form-label">
            Start Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endTime" className="form-label">
            End Time
          </label>
          <input
            type="datetime-local"
            className="form-control"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Generate Certificate
        </button>
      </form>

      {message && <div className="alert alert-info">{message}</div>}

      <h2>Certificates List</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Koi ID</th>
            <th>Order ID</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate) => (
            <tr key={certificate.id}>
              <td>{certificate.id}</td>
              <td>{certificate.koiId}</td>
              <td>{certificate.orderId}</td>
              <td>{certificate.status}</td>
              <td>{new Date(certificate.startTime).toLocaleString()}</td>
              <td>{new Date(certificate.endTime).toLocaleString()}</td>
              <td>{new Date(certificate.createdDate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CertificateManager;
