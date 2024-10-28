/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";

const KoiDetails = () => {
  const { id } = useParams();
  const [koi, setKoi] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://localhost:7229/api/KoiFish/${id}`)
      .then((response) => setKoi(response.data))
      .catch((error) => console.error("Error fetching Koi details:", error));
  }, [id]);

  const handleAddToCart = () => {
    // Add koi fish to cart logic
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.push(koi);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    alert("Koi Fish added to cart!");
    navigate("/cart");
  };

  if (!koi) return <p>Loading...</p>;

  return (
    <Container>
      <h2 className="my-4">Koi Fish Details</h2>
      <Card>
        <Card.Body>
          <Card.Title>{koi.species}</Card.Title>
          <Card.Text>Origin: {koi.origin}</Card.Text>
          <Card.Text>Gender: {koi.gender}</Card.Text>
          <Card.Text>Age: {koi.age} years</Card.Text>
          <Card.Text>Size: {koi.size} cm</Card.Text>
          <Card.Text>Character: {koi.character}</Card.Text>
          <Card.Text>Food Amount: {koi.amountFood} kg</Card.Text>
          <Card.Text>Screening Rate: {koi.screeningRate}%</Card.Text>
          <Card.Text>Type: {koi.type}</Card.Text>
          <Card.Text>Status: {koi.status}</Card.Text>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default KoiDetails;
