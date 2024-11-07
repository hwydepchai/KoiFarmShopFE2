/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useParams } from "react-router-dom";

function KoiFishyDetails() {
  const { id } = useParams(); // Retrieve the koi fish ID from the route parameters
  const [koiDetails, setKoiDetails] = useState(null);
  const [categoryName, setCategoryName] = useState(""); // Store the category name
  const [images, setImages] = useState([]); // Store the images

  useEffect(() => {
    const fetchKoiDetails = async () => {
      try {
        // Fetch koi fish details
        const response = await axios.get(
          `https://localhost:7229/api/KoiFishy/${id}`
        );
        setKoiDetails(response.data);

        // Fetch category details if categoryId is available
        if (response.data.categoryId) {
          try {
            const categoryResponse = await axios.get(
              `https://localhost:7229/api/Category/${response.data.categoryId}`
            );
            setCategoryName(categoryResponse.data.category1);
          } catch (categoryError) {
            console.error("Error fetching category data:", categoryError);
            setCategoryName("Unknown"); // Default if category fetch fails
          }
        }

        // Fetch images related to the koi fish
        const imageResponse = await axios.get(
          `https://localhost:7229/api/Image`
        );
        const koiImages = imageResponse.data.$values.filter(
          (image) => image.koiFishyId === parseInt(id) // Match images by koiFishyId
        );
        setImages(koiImages);
      } catch (error) {
        console.error("Error fetching koi fish details:", error);
      }
    };

    fetchKoiDetails();
  }, [id]);

  if (!koiDetails) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Koi Fish Details</h2>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{koiDetails.id}</td>
          </tr>
          <tr>
            <th>Price</th>
            <td>${koiDetails.price}</td>
          </tr>
          <tr>
            <th>Category</th>
            <td>{categoryName}</td>
          </tr>
          <tr>
            <th>Category ID</th>
            <td>{koiDetails.categoryId}</td>
          </tr>
          <tr>
            <th>Quantity</th>
            <td>{koiDetails.quantity}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{koiDetails.status}</td>
          </tr>
          <tr>
            <th>Created Date</th>
            <td>{koiDetails.createdDate}</td>
          </tr>
          <tr>
            <th>Modified Date</th>
            <td>{koiDetails.modifiedDate}</td>
          </tr>
          <tr>
            <th>Deleted Date</th>
            <td>{koiDetails.deletedDate ? koiDetails.deletedDate : "N/A"}</td>
          </tr>
          <tr>
            <th>Is Deleted</th>
            <td>{koiDetails.isDeleted ? "True" : "False"}</td>
          </tr>
        </tbody>
      </table>

      <h3>Images</h3>
      <div className="row">
        {images.length > 0 ? (
          images.map((image) => (
            <div key={image.id} className="col-md-4 mb-4">
              <img
                src={image.urlPath}
                alt={`Koi fish image ${image.id}`}
                className="img-fluid"
                style={{ height: "200px", objectFit: "cover" }}
              />
            </div>
          ))
        ) : (
          <p>No images available</p>
        )}
      </div>
    </div>
  );
}

export default KoiFishyDetails;
