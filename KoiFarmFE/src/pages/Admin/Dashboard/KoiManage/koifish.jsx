/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function KoiFishList() {
  const [koiList, setKoiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7229/api/KoiFish") // Fetch list of Koi from API
      .then((response) => response.json())
      .then((data) => {
        setKoiList(data);
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
    <div className="container my-4">
      <h2 className="text-center mb-4">Available Koi Fish</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Origin</th>
            <th scope="col">Gender</th>
            <th scope="col">Species</th>
            <th scope="col">Size</th>
            <th scope="col">Status</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {koiList.map((koi) => (
            <tr key={koi.id}>
              <td>{koi.id}</td>
              <td>{koi.origin}</td>
              <td>{koi.gender}</td>
              <td>{koi.species}</td>
              <td>{koi.size}</td>
              <td>{koi.status}</td>
              <td>
                <Link to={`/dashboard/koifish/${koi.id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KoiFishList;
