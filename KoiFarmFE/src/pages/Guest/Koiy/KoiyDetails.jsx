import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const KoiyDetails = () => {
  const { id } = useParams();
  const [koiyDetails, setKoiyDetails] = useState(null);
  const [images, setImages] = useState([]); // Store koi fish images
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null); // Error message
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

        const userData = JSON.parse(localStorage.getItem("user"));
        const userId = userData?.userId;

        if (userId) {
          const cartResponse = await axios.get(
            "https://localhost:7229/api/Cart"
          );
          const userCart = cartResponse.data.$values.find(
            (cart) => cart.accountId === userId && !cart.isDeleted
          );

          if (userCart) {
            const cartItemsResponse = await axios.get(
              `https://localhost:7229/api/CartItem?cartId=${userCart.id}`
            );
            const isInCart = cartItemsResponse.data.$values.some(
              (item) => item.koiFishyId === parseInt(id)
            );
            setKoiyDetails((prevDetails) => ({
              ...prevDetails,
              isInCart,
            }));
          }
        }

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

      // Fetch or create a cart for the user
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
        // Create a new cart if none exists
        const newCartRes = await axios.post(
          "https://localhost:7229/api/Cart",
          {
            accountId: userId,
            quantity: 0,
            price: 0,
          },
          config
        );
        userCart = newCartRes.data;
      }

      // Create the CartItem
      const cartItem = {
        cartId: userCart.id,
        koiFishId: null, // koiFishId is null
        koiFishyId: koiyDetails.id, // Assign koiFishyId
        consignmentId: null, // consignmentId is null
        price: koiyDetails.price,
      };

      await axios.post("https://localhost:7229/api/CartItem", cartItem, config);

      // Show success message and navigate to cart
      alert("Koi fish added to cart successfully!");
      navigate("/card");
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
        {/* Main Card for Koi Details */}
        <div className="col-lg-8 col-md-12 mb-4">
          <div className="card shadow-lg rounded">
            <div className="card-body">
              <h5 className="card-title text-success">
                Price: {koiyDetails.price} VND
              </h5>
              <p className="card-text">
                <strong>Quantity:</strong> {koiyDetails.quantity}
              </p>
              <p className="card-text">
                <strong>Status:</strong> {koiyDetails.status}
              </p>
              <p className="card-text">
                <strong>Created Date:</strong>{" "}
                {new Date(koiyDetails.createdDate).toLocaleDateString()}
              </p>

              {/* Order Button */}
              <div className="text-center mt-4">
                <button
                  className="btn btn-lg btn-success"
                  onClick={handleAddToCart}
                  disabled={
                    koiyDetails.isDeleted ||
                    koiyDetails.status === "pending" ||
                    koiyDetails.isInCart
                  }
                >
                  Add to Cart
                </button>
                {koiyDetails.isInCart && (
                  <p className="text-success text-center mt-2">
                    This koi is already in your cart.
                  </p>
                )}
                {koiyDetails.status === "pending" && (
                  <p className="text-danger text-center mt-2">
                    This koi is currently pending and cannot be added to the
                    cart.
                  </p>
                )}
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
};

export default KoiyDetails;
