/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const User = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const userId = JSON.parse(localStorage.getItem("user")).userId;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`https://localhost:7229/api/Accounts/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
        setFormData({
          ...response.data,
          modifiedDate: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to fetch user data:", error.message);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const validateField = (name, value) => {
    let error = "";

    if (name === "name") {
      error = /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(value) ? "" : "Each word should start with an uppercase letter.";
    } else if (name === "email") {
      error = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value) ? "" : "Enter a valid email format.";
    } else if (name === "phone") {
      error = /^0\d{9}$/.test(value) ? "" : "Phone should start with 0 and be 10 digits.";
    } else if (name === "password") {
      error = /^(?=.*[A-Z]).{8,}$/.test(value) ? "" : "Password must be at least 8 characters with an uppercase letter.";
    } else if (name === "dateOfBirth") {
      error = value ? "" : "Date of Birth is required.";
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      modifiedDate: new Date().toISOString(), // Update modifiedDate to the current date
    }));
    validateField(name, value);
  };

  const handleSave = async () => {
    // Ensure no validation errors
    const isValid = Object.values(errors).every((error) => !error);
    if (!isValid) {
      alert("Please correct the errors before saving.");
      return;
    }

    try {
      await axios.put(`https://localhost:7229/api/Accounts/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(formData); // Update user data with the edited data
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Failed to update profile:", error.message);
      alert("Error updating profile. Please try again.");
    }
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h2>User Profile</h2>
          <button className="btn btn-light btn-sm" onClick={handleEditClick}>
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </div>
        <div className="card-body">
          <table className="table table-bordered table-hover">
            <tbody>
              {[
                { label: "Name", key: "name" },
                { label: "Email", key: "email" },
                { label: "Gender", key: "gender" },
                { label: "Phone", key: "phone" },
                { label: "Address", key: "address" },
                { label: "Date of Birth", key: "dateOfBirth" },
                { label: "Modified Date", key: "modifiedDate", readonly: true },
                { label: "Points", key: "point", readonly: true },
                { label: "Status", key: "status", readonly: true },
                { label: "Consignments", key: "consignments", readonly: true },
                { label: "Feedback", key: "feedbacks", readonly: true },
              ].map(({ label, key, readonly }) => (
                <tr key={key}>
                  <th scope="row">{label}</th>
                  <td>
                    {isEditing && !readonly ? (
                      key === "gender" ? (
                        <select
                          className="form-control"
                          name="gender"
                          value={formData.gender || ""}
                          onChange={handleInputChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Others">Others</option>
                        </select>
                      ) : key === "dateOfBirth" ? (
                        <input
                          type="date"
                          className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                          name={key}
                          value={formData[key] || ""}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <input
                          type={key === "password" ? "password" : "text"}
                          className={`form-control ${errors[key] ? "is-invalid" : ""}`}
                          name={key}
                          value={formData[key] || ""}
                          onChange={handleInputChange}
                        />
                      )
                    ) : key === "consignments" || key === "feedbacks" ? (
                      userData[key]?.$values.length || 0
                    ) : (
                      userData[key] || "Not provided"
                    )}
                    {errors[key] && <div className="invalid-feedback">{errors[key]}</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isEditing && (
          <div className="card-footer text-center">
            <button className="btn btn-success" onClick={handleSave}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default User;
