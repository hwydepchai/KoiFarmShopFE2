/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function KoiFishy() {
  const [koiFishList, setKoiFishList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiFishData = async () => {
      try {
        const response = await axios.get("https://localhost:7229/api/KoiFishy");
        const koiFishList = response.data.$values;

        // Fetch category names for each koi fish
        const koiFishWithCategory = await Promise.all(
          koiFishList.map(async (koi) => {
            if (koi.categoryId) {
              try {
                const categoryResponse = await axios.get(
                  `https://localhost:7229/api/Category/${koi.categoryId}`
                );
                koi.categoryName = categoryResponse.data.category1; // Set category name
              } catch (error) {
                console.error(
                  `Error fetching category for ID ${koi.categoryId}:`,
                  error
                );
                koi.categoryName = "Unknown"; // Default name in case of error
              }
            } else {
              koi.categoryName = "N/A"; // Handle cases with no category ID
            }
            return koi;
          })
        );

        setKoiFishList(koiFishWithCategory);
      } catch (error) {
        console.error("Error fetching koi fish data:", error);
      }
    };

    fetchKoiFishData();
  }, []);

  function handleDetail(id) {
    navigate(`/dashboard/KoiFishy/${id}`); // Navigate to the details page with koi fish ID
  }

  function handleAddKoiFishy() {
    navigate("/dashboard/KoiFishy/create"); // Navigate to the add new koi fish page
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Koi Fish List</h2>
      <button className="btn btn-success mb-3" onClick={handleAddKoiFishy}>
        Add Koi Fishy
      </button>
      <table className="table table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th>ID</th>
            <th>Price</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {koiFishList.map((koi) => (
            <tr key={koi.id}>
              <td>{koi.id}</td>
              <td>${koi.price}</td>
              <td>{koi.categoryName}</td>
              <td>{koi.quantity}</td>
              <td>{koi.status}</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => handleDetail(koi.id)}
                >
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KoiFishy;
