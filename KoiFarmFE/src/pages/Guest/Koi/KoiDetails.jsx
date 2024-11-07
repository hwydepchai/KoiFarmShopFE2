/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Row, Container } from "react-bootstrap";

const KoiDetails = () => {
  const { id } = useParams();
  const [koi, setKoi] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKoiDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7229/api/KoiFish/${id}`
        );
        setKoi(response.data);
      } catch (error) {
        console.error("Error fetching koi details:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://localhost:7229/api/Category");
        setCategories(response.data.$values);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchImages = async () => {
      try {
        const response = await axios.get("https://localhost:7229/api/Image");
        const koiImage = response.data.$values.find(
          (img) => img.koiId === parseInt(id)
        );
        setImageUrl(koiImage?.urlPath || "");
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchKoiDetails();
    fetchCategories();
    fetchImages();
  }, [id]);

  const addToCart = async () => {
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
        alert("You haven't logged in!");
        navigate("/login");
        return;
      }

      const order = {
        koiId: koi.id,
        koiFishyId: null,
        accountId: userAccount.id,
        paymentId: 1,
        status: "Pending",
        type: true,
        price: koi.price,
      };

      await axios.post("https://localhost:7229/api/Order", order);
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="mt-4 d-flex justify-content-center">
      <Card style={{ maxWidth: "800px", width: "100%" }}>
        <Row noGutters>
          <Col
            md={4}
            className="d-flex align-items-center justify-content-between"
          >
            {imageUrl ? (
              <Card.Img
                src={imageUrl}
                alt={koi.species}
                style={{
                  width: "320px",
                  height: "320px",
                  objectFit: "cover",
                  padding: "12px",
                }}
                className="rounded"
              />
            ) : (
              <div
                style={{
                  width: "320px",
                  height: "320px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f0f0f0",
                  padding: "12px",
                }}
              >
                No image available
              </div>
            )}
          </Col>
          <Col md={8}>
            <Card.Body>
              <Card.Title>
                <h2 className="text-center">{koi.species}</h2>
              </Card.Title>
              <Card.Text>
                <Row>
                  <Col xs={6}>
                    <strong>Origin:</strong> {koi.origin}
                  </Col>
                  <Col xs={6}>
                    <strong>Gender:</strong> {koi.gender}
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <strong>Age:</strong> {koi.age}
                  </Col>
                  <Col xs={6}>
                    <strong>Size:</strong> {koi.size} cm
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <strong>Price:</strong> ${koi.price}
                  </Col>
                  <Col xs={6}>
                    <strong>Category:</strong>{" "}
                    {categories.find((cat) => cat.id === koi.categoryId)
                      ?.category1 || "Unknown"}
                  </Col>
                </Row>
                <Row>
                  <Col xs={6}>
                    <strong>Character:</strong> {koi.character}
                  </Col>
                  <Col xs={6}>
                    <strong>Status:</strong> {koi.status}
                  </Col>
                </Row>
              </Card.Text>
              <Row>
                <Col xs={6}>
                  <Button onClick={addToCart} className="me-2">
                    Add to Cart
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button
                    variant="secondary"
                    onClick={() => navigate("/koifish")}
                  >
                    Back to list
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
