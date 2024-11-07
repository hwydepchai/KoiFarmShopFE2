/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function KoiyDetails() {
  const { id } = useParams();
  const [koiyDetails, setKoiyDetails] = useState(null);
  const [images, setImages] = useState([]); // Store koi fish images
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiDetails = async () => {
      try {
        // Fetch koi fish details
        const response = await axios.get(
          `https://localhost:7229/api/KoiFishy/${id}`
        );
        setKoiyDetails(response.data);

        // Fetch related images for the koi fish
        const imageResponse = await axios.get(
          `https://localhost:7229/api/Image`
        );
        const koiImages = imageResponse.data.$values.filter(
          (image) => image.koiFishyId === parseInt(id) // Match images by koiFishyId
        );
        setImages(koiImages);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching koi fish details:", error);
        setLoading(false);
      }
    };

    fetchKoiDetails();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userEmail = userData?.email;

      const accountsResponse = await axios.get(
        "https://localhost:7229/api/Accounts"
      );
      const accounts = accountsResponse.data.$values;
      const userAccount = accounts.find(
        (account) => account.email === userEmail
      );

      if (!userAccount) {
        console.error("No account found for the user.");
        return;
      }

      const order = {
        koiId: null,
        koiFishyId: koiyDetails.id,
        accountId: userAccount.id,
        paymentId: 1,
        status: "Pending",
        type: true,
        price: koiyDetails.price,
      };

      await axios.post("https://localhost:7229/api/Order", order);
      alert(`Koi Fish with ID ${id} has been added to your cart!`);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!koiyDetails) return <p>No details available.</p>;

  return (
    <div className="container mt-4">
      <h2 className="text-center">Koi Fish Details</h2>
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Price: ${koiyDetails.price}</h5>
          <p className="card-text">Quantity: {koiyDetails.quantity}</p>
          <p className="card-text">Status: {koiyDetails.status}</p>
          <p className="card-text">
            Created Date:{" "}
            {new Date(koiyDetails.createdDate).toLocaleDateString()}
          </p>

          <h3>Images</h3>
          <div className="row">
            {images.length > 0 ? (
              images.map((image) => (
                <div key={image.id} className="col-md-4 mb-4">
                  <img
                    src={image.urlPath}
                    alt={`Koi Fish Image ${image.id}`}
                    className="img-fluid"
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </div>
              ))
            ) : (
              <p>No images available</p>
            )}
          </div>

          <button className="btn btn-success mt-3" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default KoiyDetails;
