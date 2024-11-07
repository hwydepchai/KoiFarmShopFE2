/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const [userAccountId, setUserAccountId] = useState(null);
  const [koiDetails, setKoiDetails] = useState({});
  const [koiFishyDetails, setKoiFishyDetails] = useState({});

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
        const fetchedOrders = response.data.$values;
        setOrders(fetchedOrders);

        // Fetch koi details for each order
        fetchedOrders.forEach((order) => {
          if (order.koiId != null) {
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
          } else {
            // Fetch KoiFishy details if koiId is null
            axios
              .get(`https://localhost:7229/api/KoiFishy/${order.koiFishyId}`)
              .then((response) => {
                setKoiFishyDetails((prevKoiFishyDetails) => ({
                  ...prevKoiFishyDetails,
                  [order.koiId]: response.data,
                }));
              })
              .catch((error) =>
                console.error(
                  `Error fetching KoiFishy details for ${order.koiId}:`,
                  error
                )
              );
          }
        });
      })
      .catch((error) => console.error("Error fetching orders:", error));
  }, []);

  const filteredOrders = orders
    .filter((order) => order.accountId === userAccountId)
    .sort((a, b) => {
      const orderStatus = (status) => {
        if (status === "Pending") return 1;
        if (status === "") return 2;
        if (status === "Completed") return 3;
        return 4; // Default for other statuses
      };
      return orderStatus(a.status) - orderStatus(b.status);
    });

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

  const handleDelete = async (orderId) => {
    try {
      await axios.delete(`https://localhost:7229/api/Order/${orderId}`);
      setOrders(orders.filter((order) => order.id !== orderId)); // Update the orders state
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete order. Please try again later.");
    }
  };

  // Orders with koiId (not null)
  const koiOrders = filteredOrders.filter((order) => order.koiId != null);
  // Orders without koiId (null)
  const koiFishyOrders = filteredOrders.filter((order) => order.koiId === null);

  return (
    <Container>
      <h2 className="my-4">Your Cart</h2>

      {/* Table for Orders with Koi Fish */}
      <h3 className="my-4">Koi Fish Orders</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Species</th>
            <th>Price</th>
            <th>Status</th>
            <th>Purchase</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {koiOrders.map((order, index) => {
            const koi = koiDetails[order.koiId];
            const isPurchased = order.status === "Completed";

            return (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{koi ? koi.species : "Loading..."}</td>
                <td>${koi ? koi.price : "Loading..."}</td>
                <td>{isPurchased ? "Completed" : order.status}</td>
                <td>
                  {isPurchased ? (
                    "Purchased"
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => handlePurchase(order.id)}
                    >
                      Purchase
                    </Button>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Table for Orders with KoiFishy (where koiId is null) */}
      <h3 className="my-4">KoiFishy Orders</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>KoiFishy ID</th>
            <th>Price</th>
            <th>Status</th>
            <th>Purchase</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {koiFishyOrders.map((order, index) => {
            const koiFishy = koiFishyDetails[order.koiId];
            const isPurchased = order.status === "Completed";

            return (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{koiFishy ? koiFishy.id : "Loading..."}</td>
                <td>${koiFishy ? koiFishy.price : "Loading..."}</td>
                <td>{isPurchased ? "Completed" : order.status}</td>
                <td>
                  {isPurchased ? (
                    "Purchased"
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => handlePurchase(order.id)}
                    >
                      Purchase
                    </Button>
                  )}
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
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
