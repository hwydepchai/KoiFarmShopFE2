/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function KoiFishDetails() {
  const { id } = useParams(); // Extract Koi Fish ID from the URL
  const [koiDetails, setKoiDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`https://localhost:7229/api/KoiFish/${id}`) 
      .then((response) => response.json())
      .then((data) => {
        setKoiDetails(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!koiDetails) return <div>No details available</div>;

  return (
    <div className="container my-4 d-flex flex-column">
      <h2 className="text-center mb-4">Koi Fish Details</h2>

      <div className="d-flex justify-content-between">

        {/* General Information Section */}
      <div className="card mb-4 flex-fill">
        <div className="card-header">
          <h5 className="card-title">General Info</h5>
        </div>
        <div className="card-body">
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
            <strong>Age:</strong> {koiDetails.age} years
          </p>
        </div>
      </div>

      {/* Characteristics Section */}
      <div className="card mb-4 flex-fill">
        <div className="card-header">
          <h5 className="card-title">Characteristics</h5>
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>Gender:</strong> {koiDetails.gender}
          </p>
          <p className="card-text">
            <strong>Character:</strong> {koiDetails.character}
          </p>
          <p className="card-text">
            <strong>Food Amount:</strong> {koiDetails.amountFood} kg
          </p>
          <p className="card-text">
            <strong>Screening Rate:</strong> {koiDetails.screeningRate}%
          </p>
          <p className="card-text">
            <strong>Status:</strong> {koiDetails.status}
          </p>
          <p className="card-text">
            <strong>Date Added:</strong>{" "}
            {new Date(koiDetails.date).toLocaleDateString()}
          </p>
        </div>
      </div>
      </div>

      {/* Action Buttons */}
      <div className="card mb-4">
        <div className="card-header">
          <h5 className="card-title">Actions</h5>
        </div>
        <div className="card-body d-flex justify-content-between">
          <button className="btn btn-primary">✏️ Edit</button>
          <button className="btn btn-danger">🗑️ Delete</button>
          <Link to="/dashboard/koifish" className="btn btn-secondary">
            Back to List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default KoiFishDetails;
