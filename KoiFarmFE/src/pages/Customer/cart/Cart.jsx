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

    const fetchOrdersAndDetails = async () => {
      try {
        // Fetch the orders for the user
        const orderResponse = await axios.get(
          "https://localhost:7229/api/Order"
        );
        const fetchedOrders = orderResponse.data.$values;

        // Filter out orders with a "Canceled" or "Deleted" status
        const userOrders = fetchedOrders.filter(
          (order) => order.accountId === userId && order.status !== "Canceled"
        );
        setOrders(userOrders);

        // Fetch koi and koiFishy details only for species information
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
          } else if (order.koiFishyId != null) {
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
      } catch (error) {
        console.error("Error fetching orders and koi details:", error);
      }
    };

    fetchOrdersAndDetails();
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
      // Update the order's status to "Canceled" in the backend
      await axios.put(`https://localhost:7229/api/Order/${orderId}`, {
        status: "Canceled", // Ensure this status is set to "Canceled" or "Deleted"
      });

      // Optionally, update the koi or koiFishy status to false
      if (koiId) {
        await axios.put(`https://localhost:7229/api/KoiFish/${koiId}/false`);
      } else if (koiFishyId) {
        await axios.put(
          `https://localhost:7229/api/KoiFishy/${koiFishyId}/false`
        );
      }

      // Update the local state to remove the order from the display
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel order. Please try again later.");
    }
  };

  // Filter orders to show only those with "Pending" or "Active" status
  const filteredOrders = orders.filter(
    (order) => order.status === "Pending" || order.status === "Active"
  );

  return (
    <Container>
      <h2 className="my-4">Pending Orders</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Species</th>
            <th>Price (VND)</th>
            <th>Status</th>
            <th>Purchase</th>
            <th>Cancel</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order, index) => {
            const koi = koiDetails[order.koiId];
            const koiFishy = koiFishyDetails[order.koiFishyId];

            // Determine species based on whether it's a koi or koiFishy order
            const species = koi
              ? koi.species
              : koiFishy
              ? `KoiFishy no ${koiFishy.id}`
              : "Unknown Species";

            return (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{species}</td>
<<<<<<< HEAD
                <td>{order.price.toLocaleString()}</td>{" "}
=======
                <td>{order.price.toLocaleString()} VND</td>{" "}
>>>>>>> main
                {/* Use price directly from the order */}
                <td>{order.status}</td>
                <td>
                  {(order.status === "Pending" ||
                    order.status === "Active") && (
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
