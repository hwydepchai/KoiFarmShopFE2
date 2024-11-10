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

  useEffect(() => {
    // Fetch koi details
    fetch(`https://localhost:7229/api/KoiFish/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setKoiDetails(data);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!koiDetails || !categoryDetails) return <div>No details available</div>;

  return (
    <div className="container my-4">
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

      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">General Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Left Column */}
            <div className="col-md-6">
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
            </div>

            {/* Right Column */}
            <div className="col-md-6">
              <p className="card-text">
                <strong>Character:</strong> {koiDetails.character}
              </p>
              <p className="card-text">
                <strong>Age:</strong> {koiDetails.age} years
              </p>
              <p className="card-text">
                <strong>Amount of Food:</strong> {koiDetails.amountFood}
              </p>
              <p className="card-text">
                <strong>Screening Rate:</strong> {koiDetails.screeningRate}
              </p>
              <p className="card-text">
                <strong>Category:</strong> {categoryDetails?.category1}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Back to List Button */}
      <div className="d-flex justify-content-start">
        <Link to="/dashboard/koifish" className="btn btn-secondary">
          Back to List
        </Link>
      </div>
    </div>
  );
}

export default KoiFishDetails;
