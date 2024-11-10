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
      <h2 className="text-center mb-4 text-dark">Koi Fish Details</h2>

      {/* Product Card */}
      <div
        className="card mb-4 p-4 shadow-sm border-light"
        style={{ borderRadius: "15px", borderWidth: "2px" }}
      >
        <div className="row">
          {/* Left Column with Image */}
          <div className="col-md-4 d-flex justify-content-center align-items-center mb-3">
            {images.length > 0 ? (
              <img
                key={images[0].id}
                src={images[0].urlPath}
                alt={`Koi Fish ${koiDetails.id}`}
                className="img-fluid rounded border border-info shadow-lg"
                style={{
                  maxWidth: "100%",
                  maxHeight: "300px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <p>No images available for this Koi fish.</p>
            )}
          </div>

          {/* Right Column with Product Info */}
          <div className="col-md-8">
            <div className="d-flex justify-content-around" style={{}}>
              <div>
                {/* Koi Name */}
                <h4 className="text-primary">{koiDetails.species}</h4>

                {/* Price */}
                <p className="text-danger fs-4">
                  <strong>Price:</strong> {koiDetails.price} VND
                </p>
                <p className="text-black fs-4">
                  <strong> {koiDetails.type} </strong> Koi
                </p>

                {/* Action Buttons */}
                <div className="d-flex justify-content-end flex-column mt-3">
                  <Link
                    to="/dashboard/koifish"
                    className="btn btn-secondary me-2"
                  >
                    Back to List
                  </Link>
                </div>
              </div>
              <div>
                {/* General Info */}
                <div className="mb-3">
                  <p className="card-text">
                    <strong>Origin:</strong> {koiDetails.origin}
                  </p>
                  <p className="card-text">
                    <strong>Size:</strong> {koiDetails.size} cm
                  </p>
                  <p className="card-text">
                    <strong>Age:</strong> {koiDetails.age} years
                  </p>
                  <p className="card-text">
                    <strong>Screening Rate:</strong> {koiDetails.screeningRate}
                  </p>
                  <p className="card-text">
                    <strong>Amount of Food:</strong> {koiDetails.amountFood}
                  </p>
                  <p className="card-text">
                    <strong>Character:</strong> {koiDetails.character}
                  </p>
                  <p className="card-text">
                    <strong>Category:</strong> {categoryDetails?.category1}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KoiFishDetails;
