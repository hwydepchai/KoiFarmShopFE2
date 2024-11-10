/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function KoiFishDetails() {
  const { id } = useParams();
  const [koiDetails, setKoiDetails] = useState(null);
  const [categoryDetails, setCategoryDetails] = useState(null);
  const [images, setImages] = useState([]); // New state to hold images
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedKoi, setUpdatedKoi] = useState({});

  useEffect(() => {
    // Fetch koi details
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
        return fetch("https://localhost:7229/api/Image");
      })
      .then((response) => response.json())
      .then((imageData) => {
        // Filter images that match the koiId
        const filteredImages = imageData.$values.filter(
          (image) => image.koiId === parseInt(id)
        );
        setImages(filteredImages); // Store filtered images
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
        alert("Koi fish deleted successfully");
        history.push("/dashboard/koifish"); // Redirect to koi fish list
      })
      .catch((error) => {
        setError(error);
        alert("Error deleting Koi fish: " + error.message);
      });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!koiDetails || !categoryDetails) return <div>No details available</div>;

  return (
    <div className="container my-4 d-flex flex-column">
      <h2 className="text-center mb-4">Koi Fish Details</h2>

      {/* Display images */}
      <div className="d-flex flex-wrap justify-content-center mb-4">
        {images.length > 0 ? (
          images.map((image) => (
            <img
              key={image.id}
              src={image.urlPath}
              alt={`Koi Fish ${koiDetails.id}`}
              className="img-fluid m-2"
              style={{ maxWidth: "300px", maxHeight: "300px" }}
            />
          ))
        ) : (
          <p>No images available for this Koi fish.</p>
        )}
      </div>

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
                        value={updatedKoi.price + " VND"}
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
                      <strong>Price:</strong> {koiDetails.price} VND
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
                  </>
                ) : (
                  <>
                    <p className="card-text">
                      <strong>Species:</strong> {koiDetails.species}
                    </p>
                    <p className="card-text">
                      <strong>Character:</strong> {koiDetails.character}
                    </p>
                    <p className="card-text">
                      <strong>Amount of Food:</strong> {koiDetails.amountFood}
                    </p>
                    <p className="card-text">
                      <strong>Screening Rate:</strong> {koiDetails.screeningRate}
                    </p>
                    <p className="card-text">
                      <strong>Amount:</strong> {koiDetails.amount}
                    </p>
                    <p className="card-text">
                      <strong>Type:</strong> {koiDetails.type}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column justify-content-end">
          <Link to="/dashboard/koifish" className="btn btn-secondary mb-2">
            Back to List
          </Link>
          {isEditing ? (
            <button className="btn btn-success mb-2" onClick={handleUpdate}>
              Save Changes
            </button>
          ) : (
            <button
              className="btn btn-primary mb-2"
              onClick={handleEditToggle}
            >
              Edit
            </button>
          )}
          <button
            className="btn btn-danger mb-2"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default KoiFishDetails;
