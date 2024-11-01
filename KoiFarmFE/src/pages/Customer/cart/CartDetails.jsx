/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Container, Button } from "react-bootstrap";

const CartDetails = () => {
  const { cartId } = useParams();
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`https://localhost:7229/api/Cart/${cartId}`)
      .then((response) => setCart(response.data))
      .catch((error) => console.error("Error fetching Cart details:", error));
  }, [cartId]);

  const handleCreateCartDetails = async () => {
    try {
      const cartDetailsData = {
        koiId: cart.order.koiId,
        cartId: cart.id,
        feedbackId: 1, // Placeholder for feedback ID
        price: cart.price,
        status: "Pending",
      };

      await axios.post(
        "https://localhost:7229/api/CartDetails",
        cartDetailsData
      );
      alert("Cart details created successfully!");
      navigate("/checkout"); // Navigate to the next step, like a checkout page
    } catch (error) {
      console.error("Error creating cart details:", error);
      alert("Error creating cart details. Please try again.");
    }
  };

  if (!cart) return <p>Loading...</p>;

  return (
    <Container>
      <h2 className="my-4">Cart Summary</h2>
      <Card>
        <Card.Body>
          <Card.Text>Cart ID: {cart.id}</Card.Text>
          <Card.Text>Price: ${cart.price}</Card.Text>
          <Card.Text>Total Price: ${cart.totalPrice}</Card.Text>
          <Button variant="success" onClick={handleCreateCartDetails}>
            Confirm Cart Details
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CartDetails;
