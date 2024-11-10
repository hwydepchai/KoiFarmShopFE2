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
      const userId = userData?.userId;

      if (!userId) {
        console.error(
          "No user ID found in localStorage. Redirecting to login."
        );
        return;
      }

      // Add the koi fish to the cart
      const order = {
        koiId: null,
        koiFishyId: koiyDetails.id,
        accountId: userId,
        paymentId: 1,
        status: "Pending",
        type: true,
        price: koiyDetails.price,
      };

      await axios.post("https://localhost:7229/api/Order", order);

      // Delete the koi fish from the system
      await axios.delete(`https://localhost:7229/api/KoiFishy/${id}`);

      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart or deleting koi fish:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!koiyDetails) return <p>No details available.</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 text-primary">Koi Fish Details</h2>
  
      <div className="row">
        {/* Main Card for Koi Details */}
        <div className="col-lg-8 col-md-12 mb-4">
          <div className="card shadow-lg rounded">
            <div className="card-body">
              <h5 className="card-title text-success">Price: ${koiyDetails.price}</h5>
              <p className="card-text"><strong>Quantity:</strong> {koiyDetails.quantity}</p>
              <p className="card-text"><strong>Status:</strong> {koiyDetails.status}</p>
              <p className="card-text"><strong>Created Date:</strong> {new Date(koiyDetails.createdDate).toLocaleDateString()}</p>
  
              {/* Order Button */}
              <div className="text-center mt-4">
                <button className="btn btn-lg btn-success" onClick={handleAddToCart}>
                  Order Now!
                </button>
              </div>
            </div>
          </div>
        </div>
  
        {/* Image Gallery */}
        <div className="col-lg-4 col-md-12">
          <div className="card shadow-sm rounded">
            <div className="card-body">
              <h3 className="text-center mb-4">Images</h3>
              <div className="row row-cols-1 row-cols-md-12 g-3">
                {images.length > 0 ? (
                  images.map((image) => (
                    <div key={image.id} className="col mb-4">
                      <div className="card shadow-sm border-light">
                        <img
                          src={image.urlPath}
                          alt={`Koi Fish Image ${image.id}`}
                          className="card-img-top img-fluid rounded"
                          style={{
                            height: "auto",
                            objectFit: "cover",
                            aspectRatio: "7/3", // Image ratio 7:3
                            maxHeight: "300px",
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center">
                    <p>No images available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default KoiyDetails;
