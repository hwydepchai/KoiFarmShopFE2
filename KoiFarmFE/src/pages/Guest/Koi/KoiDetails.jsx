/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Container, Spinner, Alert } from "react-bootstrap";

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
        setErrorMessage("There was an error fetching koi details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const addToCart = async () => {
    if (koi.isDeleted) {
      setErrorMessage("This koi is no longer available for purchase.");
      return; // Don't proceed with the order if the koi is deleted
    }

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;

      if (!userId) {
        alert("You haven't logged in!");
        navigate("/login");
        return;
      }

      // Create order object
      const order = {
        koiId: koi.id,
        koiFishyId: null,
        accountId: userId, // User ID from localStorage
        paymentId: 1,
        status: "Pending",
        type: true,
        price: koi.price,
      };

      await axios.post("https://localhost:7229/api/Order", order);
      await axios.delete(`https://localhost:7229/api/KoiFish/${koi.id}`);

      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart or deleting koi:", error);
      setErrorMessage("There was an issue with your order. Please try again.");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>} {/* Display error message */}

      <Card className="shadow-sm">
        <Row>
          {/* Left Column: Image */}
          <Col md={5} className="d-flex justify-content-center align-items-center">
            {imageUrl ? (
              <Card.Img
                src={imageUrl}
                alt={koi.species}
                style={{ width: "100%", height: "auto", objectFit: "cover", maxHeight: "400px" }}
                className="rounded"
              />
            ) : (
              <div className="d-flex justify-content-center align-items-center" style={{ width: "100%", height: "400px", backgroundColor: "#f0f0f0" }}>
                No image available
              </div>
            )}
          </Col>

          {/* Right Column: Details */}
          <Col md={7}>
            <Card.Body>
              <Card.Title className="text-center">
                <h2>{koi.species} - {koi.type}</h2>
              </Card.Title>

              {/* Details Section */}
              <Row className="mb-3">
                <Col xs={6}><strong>Origin:</strong> {koi.origin}</Col>
                <Col xs={6}><strong>Gender:</strong> {koi.gender}</Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}><strong>Age:</strong> {koi.age}</Col>
                <Col xs={6}><strong>Size:</strong> {koi.size} cm</Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}><strong>Price:</strong> ${koi.price}</Col>
                <Col xs={6}>
                  <strong>Category:</strong> {categories.find(cat => cat.id === koi.categoryId)?.category1 || "Unknown"}
                </Col>
              </Row>
              <Row className="mb-3">
                <Col xs={6}><strong>Character:</strong> {koi.character}</Col>
                <Col xs={6}><strong>Status:</strong> {koi.status}</Col>
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
                    {koi.isDeleted ? "This koi is unavailable" : "Order Now"}
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button variant="secondary" onClick={() => navigate("/koifish")} className="w-100">
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
