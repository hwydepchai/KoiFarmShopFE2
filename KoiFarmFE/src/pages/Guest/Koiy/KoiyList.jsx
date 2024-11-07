/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";

function KoiyList() {
  const [koiFishList, setKoiFishList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKoiFishData = async () => {
      try {
        const koiResponse = await axios.get("https://localhost:7229/api/KoiFishy");
        const koiFishList = koiResponse.data.$values;

        // Fetch images and match them to koi fish items
        const imageResponse = await axios.get("https://localhost:7229/api/Image");
        const imageList = imageResponse.data.$values;

        // Combine koi fish data with their respective images
        const koiFishWithImages = await Promise.all(
          koiFishList.map(async (koi) => {
            // Assign the category name
            if (koi.categoryId) {
              try {
                const categoryResponse = await axios.get(`https://localhost:7229/api/Category/${koi.categoryId}`);
                koi.categoryName = categoryResponse.data.category1;
              } catch (error) {
                console.error(`Error fetching category for ID ${koi.categoryId}:`, error);
                koi.categoryName = "Unknown";
              }
            } else {
              koi.categoryName = "N/A";
            }

            // Attach the first image found for this koi, or set a placeholder
            const koiImage = imageList.find((image) => image.koiFishyId === koi.id);
            koi.imageUrl = koiImage ? koiImage.urlPath : "https://via.placeholder.com/150"; // Default placeholder

            return koi;
          })
        );

        setKoiFishList(koiFishWithImages);
      } catch (error) {
        console.error("Error fetching koi fish or image data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKoiFishData();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Koi Fish List</h2>
      <div className="row">
        {koiFishList.map((koi) => (
          <div key={koi.id} className="col-md-4 mb-4">
            <div className="card">
              {koi.imageUrl && (
                <img
                  src={koi.imageUrl}
                  className="card-img-top"
                  alt="Koi fish"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">Price: ${koi.price}</h5>
                <p className="card-text">Quantity: {koi.quantity}</p>
                <p className="card-text">Category: {koi.categoryName}</p>
                <p className="card-text">Status: {koi.status}</p>
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
