/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";

const Cart = () => {
  const [orders, setOrders] = useState([]);
  const [koiDetails, setKoiDetails] = useState({});
  const [koiFishyDetails, setKoiFishyDetails] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    if (!userId) {
      console.error("No user ID found in localStorage. Redirecting to login.");
      return;
    }

    axios.get("https://localhost:7229/api/Order").then((response) => {
      const fetchedOrders = response.data.$values;
      const userOrders = fetchedOrders.filter(
        (order) => order.accountId === userId
      );
      setOrders(userOrders);

      userOrders.forEach((order) => {
        if (order.koiId != null) {
          axios
            .get(`https://localhost:7229/api/KoiFish/${order.koiId}`)
            .then((response) => {
              setKoiDetails((prevKoiDetails) => ({
                ...prevKoiDetails,
                [order.koiId]: response.data,
              }));
            });
        } else {
          axios
            .get(`https://localhost:7229/api/KoiFishy/${order.koiFishyId}`)
            .then((response) => {
              setKoiFishyDetails((prevKoiFishyDetails) => ({
                ...prevKoiFishyDetails,
                [order.koiFishyId]: response.data,
              }));
            });
        }
      });
    });
  }, []);

  const handlePurchase = async (orderId) => {
    try {
      const response = await axios.post(
        `https://localhost:7229/api/Payment?orderId=${orderId}`
      );
      const paymentUrl = response.data.paymentUrl;
      if (paymentUrl) {
        window.open(paymentUrl, "_blank", "noopener,noreferrer");
      } else {
        alert("Payment URL not provided.");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Failed to process payment. Please try again later.");
    }
  };

  const handleDelete = async (orderId, koiId, koiFishyId) => {
    try {
      // First, cancel the order by deleting it
      await axios.delete(`https://localhost:7229/api/Order/${orderId}`);

      // Then, update the koi or koiFishy status to false
      if (koiId) {
        await axios.put(`https://localhost:7229/api/KoiFish/${koiId}/false`);
      } else if (koiFishyId) {
        await axios.put(
          `https://localhost:7229/api/KoiFishy/${koiFishyId}/false`
        );
      }

      await axios.put(`https://localhost:7229/api/Order/${orderId}`, {
        status: "Deleted",
      });

      // Update the local state to reflect the removal
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again later.");
    }
  };

  const filteredOrders = orders.filter((order) => order.status === "Pending");

  return (
    <Container>
      <h2 className="my-4">Pending Orders</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Species</th>
            <th>Price</th>
            <th>Status</th>
            <th>Purchase</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => {
            const koi = koiDetails[order.koiId];
            const koiFishy = koiFishyDetails[order.koiFishyId];

            // Determine species and price based on whether it's a koi or koiFishy order
            const species = koi
              ? koi.species
              : koiFishy
              ? `KoiFishy no ${koiFishy.id}`
              : "Loading...";
            const price = koi
              ? koi.price
              : koiFishy
              ? koiFishy.price
              : "Loading...";

            return (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{species}</td>
                <td>${price}</td>
                <td>{order.status}</td>
                <td>
                  <Button
                    variant="success"
                    onClick={() => handlePurchase(order.id)}
                  >
                    Purchase
                  </Button>
                </td>
                <td>
                  <Button
                    variant="danger"
                    onClick={() =>
                      handleDelete(order.id, order.koiId, order.koiFishyId)
                    }
                  >
                    Cancel
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
