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
    <div className="container my-5">
      <h2 className="text-center mb-5 text-dark">Koi Fish Details</h2>

      {/* Product Card */}
      <div
        className="card mb-5 p-4 shadow-lg border-light"
        style={{ borderRadius: "15px", borderWidth: "2px" }}
      >
        <div className="row">
          {/* Left Column with Image */}
          <div className="col-md-4 mb-4">
            {images.length > 0 ? (
              <img
                key={images[0].id}
                src={images[0].urlPath}
                alt={`Koi Fish ${koiDetails.id}`}
                className="img-fluid rounded border border-info shadow-lg"
                style={{
                  width: "400px",
                  maxWidth: "400px",
                  maxHeight: "2000px",
                  borderRadius: "10px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <p>No images available for this Koi fish.</p>
            )}
            <Link
              to="/dashboard/koifish"
              className="btn btn-secondary me-2 mt-5"
              style={{
                width: "400px",
                maxWidth: "400px",
                maxHeight: "2000px",
                borderRadius: "10px",
                objectFit: "cover",
              }}
            >
              Back to List
            </Link>
          </div>

          {/* Right Column with Product Info */}

          <div className="col-md-8">
            {/* Koi Name and Type */}
            <div className="mb-4">
              <h4 className="text-primary mb-2">
                <strong>{koiDetails.name}</strong>
                {koiDetails.type}
              </h4>
            </div>

            {/* Price */}
            <p className="text-danger fs-4 mb-3">
              <strong>Price:</strong> {koiDetails.price} VND
            </p>

            {/* Category */}
            <p className="card-text mb-3">
              <strong>Category:</strong> {categoryDetails?.category1}
            </p>
            <div className="">
              <div className="row">
                {/* General Info Section */}
                <div className="border-top pt-3 col-md-6">
                  <h5 className="text-dark mb-3">General Information</h5>
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
                </div>

                {/* Additional Info Section */}
                <div className="border-top pt-3 col-md-6">
                  <h5 className="text-dark mb-3">Additional Information</h5>
                  <p className="card-text">
                    <strong>Gender:</strong> {koiDetails.gender}
                  </p>
                  <p className="card-text">
                    <strong>Year of Birth:</strong> {koiDetails.yearOfBirth}
                  </p>
                  <p className="card-text">
                    <strong>Variety:</strong> {koiDetails.variety}
                  </p>
                  <p className="card-text">
                    <strong>Status:</strong> {koiDetails.status}
                  </p>
                  <p className="card-text">
                    <strong>Origin Certificate ID:</strong>{" "}
                    {koiDetails.originCertificateId}
                  </p>
                  <p>
                    <strong>Variety:</strong> {koiDetails.variety}
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
