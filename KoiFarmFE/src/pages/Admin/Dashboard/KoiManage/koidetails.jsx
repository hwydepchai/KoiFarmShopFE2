/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function KoiFishDetails() {
  const { id } = useParams();
  const [koiDetails, setKoiDetails] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedKoi, setUpdatedKoi] = useState({});

  useEffect(() => {
    fetch(`https://localhost:7229/api/KoiFish/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setKoiDetails(data);
        setUpdatedKoi(data); // Initialize with existing koi details
        return data.categoryId;
      })
      .then((categoryId) => {
        return fetch(`https://localhost:7229/api/Category/${categoryId}`);
      })
      .then((response) => response.json())
      .then((categoryData) => {
        setCategoryDetails(categoryData);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedKoi((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = () => {
    updatedKoi.date = new Date(updatedKoi.date).toISOString(); // Ensure date is in the correct format
    fetch(`https://localhost:7229/api/KoiFish/${id}`, {
      method: "PUT", // Change POST to PUT
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedKoi),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update Koi fish details");
        }
        return response.json();
      })
      .then(() => {
        setKoiDetails(updatedKoi);
        setIsEditing(false);
      })
      .catch((error) => {
        setError(error);
      });
  };

  const handleDelete = () => {
    fetch(`https://localhost:7229/api/KoiFish/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete Koi fish");
        }
        // Redirect or handle successful deletion, e.g., show a success message
      })
      .catch((error) => {
        setError(error);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!koiDetails || !categoryDetails) return <div>No details available</div>;

  return (
    <div className="container my-4 d-flex flex-column">
      <h2 className="text-center mb-4">Koi Fish Details</h2>

      <div className="d-flex justify-content-between">
        <div className="card mb-4 flex-fill">
          <div className="card-header">
            <h5 className="card-title">General Info</h5>
          </div>
          <div className="card-body">
            <div className="row">
              {/* Left Column */}
              <div className="col-md-6">
                {isEditing ? (
                  <>
                    <div className="mb-2">
                      <label>Origin:</label>
                      <input
                        type="text"
                        name="origin"
                        value={updatedKoi.origin}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Price:</label>
                      <input
                        type="number"
                        name="price"
                        value={updatedKoi.price}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Gender:</label>
                      <input
                        type="text"
                        name="gender"
                        value={updatedKoi.gender}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Age:</label>
                      <input
                        type="number"
                        name="age"
                        value={updatedKoi.age}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Size (cm):</label>
                      <input
                        type="number"
                        name="size"
                        value={updatedKoi.size}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="card-text">
                      <strong>ID:</strong> #{koiDetails.id}
                    </p>
                    <p className="card-text">
                      <strong>Origin:</strong> {koiDetails.origin}
                    </p>
                    <p className="card-text">
                      <strong>Species:</strong> {koiDetails.species}
                    </p>
                    <p className="card-text">
                      <strong>Size:</strong> {koiDetails.size} cm
                    </p>
                    <p className="card-text">
                      <strong>Price:</strong> ${koiDetails.price}
                    </p>
                    <p className="card-text">
                      <strong>Age:</strong> {koiDetails.age} years
                    </p>
                  </>
                )}
              </div>
              {/* Right Column */}
              <div className="col-md-6">
                {isEditing ? (
                  <>
                    <div className="mb-2">
                      <label>Species:</label>
                      <input
                        type="text"
                        name="species"
                        value={updatedKoi.species}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Character:</label>
                      <input
                        type="text"
                        name="character"
                        value={updatedKoi.character}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Amount of Food:</label>
                      <input
                        type="number"
                        name="amountFood"
                        value={updatedKoi.amountFood}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Screening Rate:</label>
                      <input
                        type="number"
                        name="screeningRate"
                        value={updatedKoi.screeningRate}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Amount:</label>
                      <input
                        type="number"
                        name="amount"
                        value={updatedKoi.amount}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Type:</label>
                      <input
                        type="text"
                        name="type"
                        value={updatedKoi.type}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Date:</label>
                      <input
                        type="datetime-local"
                        name="date"
                        value={
                          updatedKoi.date
                            ? new Date(updatedKoi.date)
                                .toISOString()
                                .substring(0, 16)
                            : ""
                        }
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                    <div className="mb-2">
                      <label>Status:</label>
                      <input
                        type="text"
                        name="status"
                        value={updatedKoi.status}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="card-text">
                      <strong>Category:</strong> {categoryDetails.category1}
                    </p>
                    <p className="card-text">
                      <strong>Type:</strong> {koiDetails.type}
                    </p>
                    <p className="card-text">
                      <strong>Gender:</strong> {koiDetails.gender}
                    </p>
                    <p className="card-text">
                      <strong>Character:</strong> {koiDetails.character}
                    </p>
                    <p className="card-text">
                      <strong>Amount of Food:</strong> {koiDetails.amountFood}
                    </p>
                    <p className="card-text">
                      <strong>Screening Rate:</strong>{" "}
                      {koiDetails.screeningRate}
                    </p>
                    <p className="card-text">
                      <strong>Amount:</strong> {koiDetails.amount}
                    </p>
                    <p className="card-text">
                      <strong>Date:</strong>{" "}
                      {koiDetails.date
                        ? new Date(koiDetails.date).toLocaleString()
                        : "N/A"}
                    </p>

                    <p className="card-text">
                      <strong>Status:</strong> {koiDetails.status}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Actions</h5>
        </div>
        <div className="card-body d-flex justify-content-between">
          {isEditing ? (
            <>
              <button className="btn btn-success" onClick={handleUpdate}>
                💾 Save
              </button>
              <button className="btn btn-secondary" onClick={handleEditToggle}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={handleEditToggle}>
                ✏️ Edit
              </button>
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑️ Delete
              </button>
            </>
          )}
          <Link to="/dashboard/koifish" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default KoiFishDetails;
