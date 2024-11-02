/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const [userAccountId, setUserAccountId] = useState(null);
  const [koiDetails, setKoiDetails] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user?.email;

    // Fetch account details to get the accountId of the logged-in user
    axios
      .get("https://localhost:7229/api/Accounts")
      .then((response) => {
        const userAccount = response.data.$values.find(
          (account) => account.email === userEmail
        );
        if (userAccount) setUserAccountId(userAccount.id);
      })
      .catch((error) =>
        console.error("Error fetching account details:", error)
      );

    // Fetch all orders
    axios
      .get("https://localhost:7229/api/Order")
      .then((response) => {
        const fetchedOrders = response.data.$values; // Adjusted to access $values
        setOrders(fetchedOrders);

        // Fetch koi details for each order
        fetchedOrders.forEach((order) => {
          axios
            .get(`https://localhost:7229/api/KoiFish/${order.koiId}`)
            .then((response) => {
              setKoiDetails((prevKoiDetails) => ({
                ...prevKoiDetails,
                [order.koiId]: response.data,
              }));
            })
            .catch((error) =>
              console.error(
                `Error fetching koi details for ${order.koiId}:`,
                error
              )
            );
        });
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  // Filter orders for the logged-in user's account
  const filteredOrders = orders.filter(
    (order) => order.accountId === userAccountId
  );

  // Handle Purchase
  const handlePurchase = async (orderId) => {
    try {
      const response = await axios.post(
        `https://localhost:7229/api/Payment?orderId=${orderId}`
      );
      const paymentUrl = response.data.paymentUrl;
      if (paymentUrl) {
        window.open(paymentUrl, "_blank", "noopener,noreferrer"); // Open payment URL in new tab
      } else {
        alert("Payment URL not provided.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again later.");
    }
  };

  return (
    <Container>
      <h2 className="my-4">Your Cart</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Species</th>
            <th>Price</th>
            <th>Status</th>
            <th>Purchase</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => {
            const koi = koiDetails[order.koiId];
            return (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{koi ? koi.species : "Loading..."}</td>
                <td>${koi ? koi.price : "Loading..."}</td>
                <td>{order.status}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handlePurchase(order.id)}
                  >
                    Purchase
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default Cart;
