/* eslint-disable no-unused-vars */
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
  const [certificate, setCertificate] = useState(null);
  const [certificateImages, setCertificateImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [koiRes, categoriesRes, imagesRes] = await Promise.all([
          axios.get(`https://localhost:7229/api/KoiFish/${id}`),
          axios.get("https://localhost:7229/api/Category"),
          axios.get("https://localhost:7229/api/Image"),
          axios.get("https://localhost:7229/api/Cart"),
        ]);

        const koiData = koiRes.data;
        setKoi(koiData);
        setCategories(categoriesRes.data.$values);

        const koiImage = imagesRes.data.$values.find(
          (img) => img.koiId === parseInt(id)
        );
        setImageUrl(koiImage?.urlPath || "");

        if (koiData.originCertificateId) {
          const certRes = await axios.get(
            `https://localhost:7229/api/OriginCertificate/${koiData.originCertificateId}`
          );
          setCertificate(certRes.data);

          const userData = JSON.parse(localStorage.getItem("user"));
          const userId = userData?.userId;
          const userCart = cartRes.data.$values.find(
            (cart) => cart.accountId === userId && !cart.isDeleted
          );

          if (userCart) {
            const cartItemsRes = await axios.get(
              `https://localhost:7229/api/CartItem?cartId=${userCart.id}`
            );
            const isInCart = cartItemsRes.data.$values.some(
              (item) => item.koiFishId === koiData.id
            );
            setKoi({ ...koiData, isInCart });
          }

          // Filter images
          const certImages = imagesRes.data.$values.filter(
            (img) => img.originCertificateId === koiData.originCertificateId
          );
          setCertificateImages(certImages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
      if (koi.status === "pending") {
        setErrorMessage("This koi is pending and cannot be added to the cart.");
        return;
      }

      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;

      if (!userId) {
        alert("You haven't logged in!");
        navigate("/login");
        return;
      }

      const cartRes = await axios.get("https://localhost:7229/api/Cart");
      let userCart = cartRes.data.$values.find(
        (cart) => cart.accountId === userId && !cart.isDeleted
      );

      if (!userCart) {
        const newCartRes = await axios.post("https://localhost:7229/api/Cart", {
          accountId: userId,
          quantity: 0,
          price: 0,
        });
        userCart = newCartRes.data;
      }

      const cartItemsRes = await axios.get(
        `https://localhost:7229/api/CartItem?cartId=${userCart.id}`
      );
      const isAlreadyInCart = cartItemsRes.data.$values.some(
        (item) => item.koiFishId === koi.id
      );

      if (isAlreadyInCart) {
        setErrorMessage("This koi has already been added to the cart.");
        return;
      }

      const cartItem = {
        cartId: userCart.id,
        koiFishId: koi.id,
        koiFishyId: null,
        consignmentId: null,
        price: koi.price,
      };

      await axios.post("https://localhost:7229/api/CartItem", cartItem);
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
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Card className="shadow-sm">
        <Row>
          <Col
            md={5}
            className="d-flex justify-content-center align-items-center"
          >
            {imageUrl ? (
              <Card.Img
                src={imageUrl}
                alt={koi.name}
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

          <Col md={7}>
            <Card.Body>
              <Card.Title className="text-center">
                <h2>
                  {koi.name} - {koi.variety}
                </h2>
              </Card.Title>

              {/* Koi Details */}
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
                  <strong>Year of Birth:</strong> {koi.yearOfBirth}
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
                  <strong>Diet:</strong> {koi.diet}
                </Col>
              </Row>

              <Row>
                <Col xs={6} className="text-end">
                  <Button
                    variant="primary"
                    onClick={addToCart}
                    className="w-100"
                    disabled={
                      koi.isDeleted || koi.status === "pending" || koi.isInCart
                    }
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

      {/* Certificate Details */}
      {certificate && (
        <Card className="mt-4">
          <Card.Header>Origin Certificate</Card.Header>
          <Card.Body>
            {/* Certificate Images */}
            <Row className="mt-2">
              {certificateImages.length > 0 ? (
                certificateImages.map((img) => (
                  <Col key={img.id} xs={6} md={4} lg={3} className="mb-3">
                    <Card.Img
                      src={img.urlPath}
                      alt={`Certificate Image ${img.id}`}
                      className="rounded shadow-sm"
                      style={{ width: "100%", height: "auto" }}
                    />
                  </Col>
                ))
              ) : (
                <Col>No images available</Col>
              )}
              <Col xs={6}>
                <strong>Date:</strong>{" "}
                {new Date(certificate.date).toLocaleDateString()}
                <br />
                <strong>Place of Issue:</strong> {certificate.placeOfIssue}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default KoiDetails;
