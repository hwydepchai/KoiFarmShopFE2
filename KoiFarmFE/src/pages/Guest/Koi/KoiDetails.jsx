/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Container } from "react-bootstrap";

const KoiDetails = () => {
  const { id } = useParams();
  const [koi, setKoi] = useState(null);
  const [accountId, setAccountId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch koi details
    axios
      .get(`https://localhost:7229/api/KoiFish/${id}`)
      .then((response) => setKoi(response.data))
      .catch((error) => console.error("Error fetching Koi details:", error));
  }, [id]);

  useEffect(() => {
    // Retrieve user email from localStorage and fetch account details
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      axios
        .get("https://localhost:7229/api/Accounts")
        .then((response) => {
          const account = response.data.find((acc) => acc.email === user.email);
          if (account) setAccountId(account.id);
        })
        .catch((error) => console.error("Error fetching account details:", error));
    }
  }, []);

  const handleOrder = async () => {
    try {
      if (!accountId || !koi) {
        alert("Unable to fetch account or koi details.");
        return;
      }

      // Post the order with required parameters
      await axios.post("https://localhost:7229/api/Order", {
        koiId: koi.id,
        koiFishyId: null,
        accountId,
        paymentId: 1,
        status: null,
        type: null,
        price: koi.price,
      });

      alert("Koi Fish added to your orders!");
      navigate("/cart");
    } catch (error) {
      console.error("Error creating order:", error);
      alert("There was an issue adding the koi to your orders.");
    }
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
          <Button variant="primary" onClick={handleOrder}>
            Add to cart
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default KoiDetails;
