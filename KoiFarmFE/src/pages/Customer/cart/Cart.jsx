/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";

const Cart = () => {
  const location = useLocation();
  const { cartId } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [koiDetails, setKoiDetails] = useState({});
  const [koiFishyDetails, setKoiFishyDetails] = useState({});
  const [accountDetails, setAccountDetails] = useState({}); // Lưu thông tin account

  useEffect(() => {
    const fetchOrdersAndDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.userId;

        if (!userId) {
          console.error("No user ID found in localStorage.");
          return;
        }

        // Fetch all orders from the backend
        const response = await axios.get("https://localhost:7229/api/Order");
        const fetchedOrders = response.data.$values;

        // Filter out orders that are still pending (i.e., not paid or canceled)
        const pendingOrders = fetchedOrders.filter(
          (order) => order.accountId === userId && order.status === "Pending"
        );
        setOrders(pendingOrders);

        // Fetch additional details for KoiFish and KoiFishy
        pendingOrders.forEach((order) => {
          if (order.koiId != null) {
            axios
              .get(`https://localhost:7229/api/KoiFish/${order.koiId}`)
              .then((response) => {
                setKoiDetails((prev) => ({
                  ...prev,
                  [order.koiId]: response.data,
                }));
              });
          } else if (order.koiFishyId != null) {
            axios
              .get(`https://localhost:7229/api/KoiFishy/${order.koiFishyId}`)
              .then((response) => {
                setKoiFishyDetails((prev) => ({
                  ...prev,
                  [order.koiFishyId]: response.data,
                }));
              });
          }

          // Fetch account details for each order
          axios
            .get(`https://localhost:7229/api/Accounts/${order.accountId}`)
            .then((response) => {
              setAccountDetails((prev) => ({
                ...prev,
                [order.accountId]: response.data,
              }));
            });
        });
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrdersAndDetails();
  }, [cartId]);

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

  return (
    <Container>
      <h2 className="my-4">Pending Orders</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Price (VND)</th>
            <th>Status</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Purchase</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => {
            const account = accountDetails[order.accountId] || {};
            const address = account.address || "Unknown Address";
            const phone = account.phone || "Unknown Phone";

            return (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.price.toLocaleString()} VND</td>
                <td>{order.status}</td>
                <td>{address}</td>
                <td>{phone}</td>
                <td>
                  {order.status === "Pending" && (
                    <Button
                      variant="success"
                      onClick={() => handlePurchase(order.id)}
                    >
                      Purchase
                    </Button>
                  )}
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
