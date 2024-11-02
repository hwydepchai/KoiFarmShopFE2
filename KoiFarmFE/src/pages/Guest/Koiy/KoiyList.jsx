/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function KoiyList() {
  const [koiFishList, setKoiFishList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://localhost:7229/api/KoiFishy")
      .then((response) => response.json())
      .then((data) => {
        setKoiFishList(data.$values || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching koi fish data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Koi Fish List</h2>
      <div className="row">
        {koiFishList.map((koi) => (
          <div key={koi.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Price: ${koi.price}</h5>
                <p className="card-text">Quantity: {koi.quantity}</p>
                <p className="card-text">
                  Status:{" "}
                  <span
                    className={`badge ${
                      koi.status === "Available" ? "badge-success" : "badge-danger"
                    }`}
                  >
                    {koi.status}
                  </span>
                </p>
                <Link to={`/koifishy/${koi.id}`} className="btn btn-primary">
                  Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default KoiyList;
