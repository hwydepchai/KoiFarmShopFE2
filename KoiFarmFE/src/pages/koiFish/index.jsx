/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

const KoiFishDetails = () => {
  const [koiFish, setKoiFish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7229/api/KoiFish")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setKoiFish(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container my-5">
      {koiFish && (
        <div className="card shadow-lg p-4">
          <h2 className="card-title mb-4 text-center">{koiFish.species}</h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <p>
                <strong>Origin:</strong> {koiFish.origin}
              </p>
              <p>
                <strong>Gender:</strong> {koiFish.gender}
              </p>
              <p>
                <strong>Age:</strong> {koiFish.age} years
              </p>
              <p>
                <strong>Size:</strong> {koiFish.size} cm
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <p>
                <strong>Character:</strong> {koiFish.character}
              </p>
              <p>
                <strong>Status:</strong> {koiFish.status}
              </p>
              <p>
                <strong>Amount of Food:</strong> {koiFish.amountFood} kg/day
              </p>
              <p>
                <strong>Screening Rate:</strong> {koiFish.screeningRate}%
              </p>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col-md-6 mb-3">
              <p>
                <strong>Type:</strong> {koiFish.type}
              </p>
              <p>
                <strong>Date Added:</strong>{" "}
                {new Date(koiFish.date).toLocaleDateString()}
              </p>
            </div>
            <div className="col-md-6 mb-3">
              <p>
                <strong>Created Date:</strong>{" "}
                {new Date(koiFish.createdDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KoiFishDetails;
