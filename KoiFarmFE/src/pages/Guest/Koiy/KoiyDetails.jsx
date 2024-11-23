/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Tab, Tabs } from "react-bootstrap"; // Bootstrap for tabs

const KoiyDetails = () => {
  const { id } = useParams();
  const [koiyDetails, setKoiyDetails] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7229/api/KoiFishy/${id}`
        );
        setKoiyDetails(response.data);
        const imageResponse = await axios.get(
          `https://localhost:7229/api/Image`
        );
        const koiImages = imageResponse.data.$values.filter(
          (image) => image.koiFishyId === parseInt(id)
        );
        setImages(koiImages);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching koi fish details:", error);
        setErrorMessage("Unable to fetch koi fish details.");
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
        alert("You haven't logged in!");
        navigate("/login");
        return;
      }

      if (koiyDetails.status === "Pending") {
        setErrorMessage(
          "This koi fish is pending and cannot be added to the cart."
        );
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };
      const cartRes = await axios.get(
        "https://localhost:7229/api/Cart",
        config
      );
      let userCart = cartRes.data.$values.find(
        (cart) => cart.accountId === userId && !cart.isDeleted
      );

      if (!userCart) {
        const newCartRes = await axios.post(
          "https://localhost:7229/api/Cart",
          { accountId: userId, quantity: 0, price: 0 },
          config
        );
        userCart = newCartRes.data;
      }

      const cartItem = {
        cartId: userCart.id,
        koiFishyId: koiyDetails.id,
        price: koiyDetails.price,
      };
      await axios.post("https://localhost:7229/api/CartItem", cartItem, config);

      alert("Koi fish added to cart successfully!");
      navigate("/cart");
    } catch (error) {
      console.error("Error adding koi fish to cart:", error);
      setErrorMessage(
        "There was an issue adding this koi to your cart. Please try again."
      );
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!koiyDetails) return <p>No details available.</p>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-5 text-primary">Koi Fish Details</h2>

      {errorMessage && (
        <div className="alert alert-danger text-center">{errorMessage}</div>
      )}

      <div className="row">
        <div className="col-lg-8 col-md-12 mb-4">
          <div className="card shadow-lg rounded">
            <div className="card-body">
              <Tabs defaultActiveKey="generalInfo" id="koiy-details-tabs">
                <Tab eventKey="generalInfo" title="General Information">
                  <p>
                    <strong>Name:</strong> {koiyDetails.name || "Unknown"}
                  </p>
                  <p>
                    <strong>Origin:</strong> {koiyDetails.origin || "Unknown"}
                  </p>
                  <p>
                    <strong>Year of Birth:</strong>{" "}
                    {koiyDetails.yearOfBirth || "Unknown"}
                  </p>
                  <p>
                    <strong>Variety:</strong> {koiyDetails.variety || "Unknown"}
                  </p>
                </Tab>
                <Tab eventKey="characteristics" title="Characteristics">
                  <p>
                    <strong>Gender:</strong> {koiyDetails.gender || "Unknown"}
                  </p>
                  <p>
                    <strong>Size:</strong> {koiyDetails.size || "Unknown"}
                  </p>
                  <p>
                    <strong>Character:</strong>{" "}
                    {koiyDetails.character || "Unknown"}
                  </p>
                  <p>
                    <strong>Diet:</strong> {koiyDetails.diet || "Unknown"}
                  </p>
                </Tab>
                <Tab eventKey="status" title="Status">
                  <p>
                    <strong>Quantity:</strong> {koiyDetails.quantity}
                  </p>
                  <p>
                    <strong>Status:</strong> {koiyDetails.status || "Unknown"}
                  </p>
                  <p>
                    <strong>Created Date:</strong>{" "}
                    {new Date(koiyDetails.createdDate).toLocaleDateString()}
                  </p>
                </Tab>
              </Tabs>

              <div className="text-center mt-4">
                <button
                  className="btn btn-lg btn-success"
                  onClick={handleAddToCart}
                  disabled={
                    koiyDetails.isDeleted || koiyDetails.status === "Pending"
                  }
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4 col-md-12">
          <div className="card shadow-sm rounded">
            <div className="card-body">
              <h3 className="text-center mb-4">Images</h3>
              <div className="row text-center">
                {images.length > 0 ? (
                  images.map((image) => (
                    <div key={image.id} className="mb-4 text-center">
                      <div className="card shadow-sm border-light text-center">
                        <img
                          src={image.urlPath}
                          alt={`Koi Fish Image ${image.id}`}
                          className="card-img-top img-fluid rounded text-center"
                          style={{
                            height: "max-width",
                            objectFit: "cover",
                            aspectRatio: "6/5",
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KoiyDetails;
