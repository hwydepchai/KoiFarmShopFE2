/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";

const KoiDetails = () => {
  const { id } = useParams(); // Assume koiId is part of the URL
  const [koi, setKoi] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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

    fetchKoiDetails();
    fetchCategories();
  }, [id]);

  const addToCart = async () => {
    try {
      // Retrieve user data from local storage
      const userData = JSON.parse(localStorage.getItem("user"));
      const userEmail = userData?.email;

      // Fetch accounts to find the matching accountId
      const accountsResponse = await axios.get(
        "https://localhost:7229/api/Accounts"
      );
      const accounts = accountsResponse.data.$values;

      const userAccount = accounts.find(
        (account) => account.email === userEmail
      );

      if (!userAccount) {
        console.error("No account found for the user.");
        return;
      }

      // Prepare the order object
      const order = {
        koiId: koi.id, // Assuming `koi` is the fetched koi fish object
        koiFishyId: null, // Skipped as per instructions
        accountId: userAccount.id, // Retrieved account ID
        paymentId: 1, // Skipped as per instructions
        status: "Pending", // Default status
        type: true, // Assuming a default type, adjust as needed
        price: koi.price, // Price of the koi fish
      };

      // Make the POST request to create the order
      await axios.post("https://localhost:7229/api/Order", order);
      // Optionally redirect to the cart or show a success message
      navigate("/cart"); // Redirect to cart after successful addition
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {koi && (
        <Card>
          <Card.Body>
            <Card.Title>{koi.species}</Card.Title>
            <Card.Text>
              <strong>Origin:</strong> {koi.origin}
              <br />
              <strong>Gender:</strong> {koi.gender}
              <br />
              <strong>Age:</strong> {koi.age}
              <br />
              <strong>Size:</strong> {koi.size} cm
              <br />
              <strong>Price:</strong> ${koi.price}
              <br />
              <strong>Category:</strong>{" "}
              {categories.find((cat) => cat.id === koi.categoryId)?.category1 ||
                "Unknown"}
              <br />
              <strong>Character:</strong> {koi.character}
              <br />
              <strong>Status:</strong> {koi.status}
              <br />
            </Card.Text>
            <Button onClick={addToCart}>Add to Cart</Button>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default KoiDetails;
