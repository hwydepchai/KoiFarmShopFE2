import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Row,
  Container,
  Spinner,
  Alert,
} from "react-bootstrap";

const KoiDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [koi, setKoi] = useState(null);
  const [categories, setCategories] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // For displaying errors (if any)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch koi details, categories, and images concurrently
        const [koiRes, categoriesRes, imagesRes] = await Promise.all([
          axios.get(`https://localhost:7229/api/KoiFish/${id}`),
          axios.get("https://localhost:7229/api/Category"),
          axios.get("https://localhost:7229/api/Image"),
        ]);

        setKoi(koiRes.data);
        setCategories(categoriesRes.data.$values);

        const koiImage = imagesRes.data.$values.find(
          (img) => img.koiId === parseInt(id)
        );
        setImageUrl(koiImage?.urlPath || "");
      } catch (error) {
        console.error("Error fetching koi details:", error);
        setErrorMessage(
          "There was an error fetching koi details. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addToCart = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;

      if (!userId) {
        alert("You haven't logged in!");
        navigate("/login");
        return;
      }

      // Fetch or create a cart for the user
      const cartRes = await axios.get("https://localhost:7229/api/Cart");
      let userCart = cartRes.data.$values.find(
        (cart) => cart.accountId === userId && !cart.isDeleted
      );

      if (!userCart) {
        // Create a new cart if none exists
        const newCartRes = await axios.post("https://localhost:7229/api/Cart", {
          accountId: userId,
          quantity: 0,
          price: 0,
        });
        userCart = newCartRes.data;
      }

      // Create the CartItem
      const cartItem = {
        cartId: userCart.id,
        koiFishId: koi.id, // koiFishId is selected
        koiFishyId: null, // koiFishyId is null
        consignmentId: null, // consignmentId is null
        price: koi.price,
      };

      await axios.post("https://localhost:7229/api/CartItem", cartItem);

      // Redirect to cart page
      navigate("/card");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setErrorMessage(
        "There was an issue adding this koi to your cart. Please try again."
      );
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}{" "}
      {/* Display error message */}
      <Card className="shadow-sm">
        <Row>
          {/* Left Column: Image */}
          <Col
            md={5}
            className="d-flex justify-content-center align-items-center"
          >
            {imageUrl ? (
              <Card.Img
                src={imageUrl}
                alt={koi.species}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                  maxHeight: "400px",
                }}
                className="rounded"
              />
            ) : (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{
                  width: "100%",
                  height: "400px",
                  backgroundColor: "#f0f0f0",
                }}
              >
                No image available
              </div>
            )}
          </Col>

          {/* Right Column: Details */}
          <Col md={7}>
            <Card.Body>
              <Card.Title className="text-center">
                <h2>
                  {koi.species} - {koi.type}
                </h2>
              </Card.Title>

              {/* Details Section */}
              <Row className="mb-3">
                <Col xs={6}>
                  <strong>Origin:</strong> {koi.origin}
                </Col>
                <Col xs={6}>
                  <strong>Gender:</strong> {koi.gender}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <strong>Age:</strong> {koi.age}
                </Col>
                <Col xs={6}>
                  <strong>Size:</strong> {koi.size} cm
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <strong>Price:</strong> {koi.price} VND
                </Col>
                <Col xs={6}>
                  <strong>Category:</strong>{" "}
                  {categories.find((cat) => cat.id === koi.categoryId)
                    ?.category1 || "Unknown"}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}>
                  <strong>Character:</strong> {koi.character}
                </Col>
                <Col xs={6}>
                  <strong>Status:</strong> {koi.status}
                </Col>
              </Row>

              {/* Action Buttons */}
              <Row>
                <Col xs={6} className="text-end">
                  <Button
                    variant="primary"
                    onClick={addToCart}
                    className="w-100"
                    disabled={koi.isDeleted} // Disable button if koi is deleted
                  >
                    Add to Cart
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/koifish")}
                    className="w-100"
                  >
                    Back to List
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Container>
  );
};

export default KoiDetails;
