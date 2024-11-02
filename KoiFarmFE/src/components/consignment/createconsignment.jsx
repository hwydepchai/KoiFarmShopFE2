// src/components/consignment/createconsignment.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ConsignmentForm = ({ onSubmitSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    accountId: "",
    koiId: "",
    paymentId: "",
    price: "",
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    status: "Pending",
    image: null,
  });

  // Validation function for numeric fields
  const validateNumber = (name, value) => {
    const numValue = Number(value);
    switch (name) {
      case "accountId":
      case "koiId":
      case "paymentId":
        if (numValue <= 0) {
          return `${name} must be a positive number`;
        }
        if (!Number.isInteger(numValue)) {
          return `${name} must be an integer`;
        }
        break;
      case "price":
        if (numValue <= 0) {
          return "Price must be greater than 0";
        }
        break;
      default:
        return null;
    }
    return null;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validate numbers immediately
    if (["accountId", "koiId", "paymentId", "price"].includes(name)) {
      if (value && value < 0) {
        setError(`${name} cannot be negative`);
        return;
      }
      const validationError = validateNumber(name, value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setError(null); // Clear error when input is valid
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://localhost:7229/api/Auth/login",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("token");
      }
    } catch (error) {
      setIsLoggedIn(false);
      localStorage.removeItem("token");
      if (window.confirm("Please login to continue. Go to login page?")) {
        navigate("/login");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      if (
        window.confirm(
          "Please login to create a consignment. Go to login page?"
        )
      ) {
        navigate("/login");
      }
      return;
    }

    // Validate all numeric fields before submission
    const fields = ["accountId", "koiId", "paymentId", "price"];
    for (const field of fields) {
      const validationError = validateNumber(field, formData[field]);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const submitFormData = new FormData();

      submitFormData.append("accountId", parseInt(formData.accountId));
      submitFormData.append("koiId", parseInt(formData.koiId));
      submitFormData.append("paymentId", parseInt(formData.paymentId));
      submitFormData.append("price", parseFloat(formData.price));
      submitFormData.append("startTime", formData.startTime);
      submitFormData.append("endTime", formData.endTime);
      submitFormData.append("status", "Pending");
      if (formData.image) {
        submitFormData.append("image", formData.image);
      }

      await axios.post(
        "https://localhost:7229/api/Consignments",
        submitFormData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Reset form after successful submission
      setFormData({
        accountId: "",
        koiId: "",
        paymentId: "",
        price: "",
        startTime: new Date().toISOString().slice(0, 16),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 16),
        status: "Pending",
        image: null,
      });

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create consignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow mb-4">
      <div className="flex flex-1 items-center space-x-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            setFormData({ ...formData, image: e.target.files[0] })
          }
          className="w-40 text-sm"
        />

        <input
          type="number"
          name="accountId"
          placeholder="Account ID"
          value={formData.accountId}
          onChange={handleChange}
          min="1"
          className="w-32 px-3 py-1 border rounded"
          required
        />

        <input
          type="number"
          name="koiId"
          placeholder="Koi ID"
          value={formData.koiId}
          onChange={handleChange}
          min="1"
          className="w-32 px-3 py-1 border rounded"
          required
        />

        <input
          type="number"
          name="paymentId"
          placeholder="Payment ID"
          value={formData.paymentId}
          onChange={handleChange}
          min="1"
          className="w-32 px-3 py-1 border rounded"
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          min="0.01"
          step="0.01"
          className="w-32 px-3 py-1 border rounded"
          required
        />

        <input
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) =>
            setFormData({ ...formData, startTime: e.target.value })
          }
          className="w-40 px-3 py-1 border rounded"
          required
        />

        <input
          type="datetime-local"
          value={formData.endTime}
          onChange={(e) =>
            setFormData({ ...formData, endTime: e.target.value })
          }
          className="w-40 px-3 py-1 border rounded"
          required
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !isLoggedIn}
          className={`px-4 py-1 rounded ${
            loading || !isLoggedIn
              ? "bg-gray-300 text-gray-500"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          {loading ? "..." : "Create"}
        </button>
      </div>

      {error && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-2 text-sm text-red-600 bg-red-50 px-4 py-1 rounded shadow">
          {error}
        </div>
      )}
    </div>
  );
};

export default ConsignmentForm;
