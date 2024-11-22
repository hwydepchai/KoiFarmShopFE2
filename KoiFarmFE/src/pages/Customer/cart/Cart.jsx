/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import thêm useNavigate
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Sử dụng navigate để điều hướng
  const { cartId } = location.state || {};
  const [orders, setOrders] = useState([]);
  const [accountDetails, setAccountDetails] = useState({});

  useEffect(() => {
    const fetchOrdersAndDetails = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user?.userId;

        if (!userId) {
          console.error("No user ID found in localStorage.");
          return;
        }

        const response = await axios.get("https://localhost:7229/api/Order");
        const fetchedOrders = response.data.$values;

        const pendingOrders = fetchedOrders.filter(
          (order) => order.accountId === userId && order.status === "Pending"
        );
        setOrders(pendingOrders);

        pendingOrders.forEach((order) => {
          // if (order.koiId != null) {
          //   axios
          //     .get(`https://localhost:7229/api/KoiFish/${order.koiId}`)
          //     .then((response) => {
          //       setKoiDetails((prev) => ({
          //         ...prev,
          //         [order.koiId]: response.data,
          //       }));
          //     });
          // } else if (order.koiFishyId != null) {
          //   axios
          //     .get(`https://localhost:7229/api/KoiFishy/${order.koiFishyId}`)
          //     .then((response) => {
          //       setKoiFishyDetails((prev) => ({
          //         ...prev,
          //         [order.koiFishyId]: response.data,
          //       }));
          //     });
          // }

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

  // const handleCancel = async (orderId) => {
  //   try {
  //     // Gửi yêu cầu cập nhật trạng thái đơn hàng thành "Canceled"
  //     await axios.put(`https://localhost:7229/api/Order/${orderId}`, {
  //       status: "Canceled",
  //     });

  //     navigate("/history");
  //   } catch (error) {
  //     console.error("Error canceling order:", error);
  //     alert("Failed to cancel the order. Please try again.");
  //   }
  // };

  return (
    <Container>
      <h2 className="my-4">Pending Orders</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Price (VND)</th>
            <th>Status</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Actions</th> {/* Đổi tên cột */}
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
                <td>
                  <ul>
                    {order.items?.$values && order.items.$values.length > 0 ? (
                      order.items.$values.map((item, i) => (
                        <li key={i}>{item.name}</li>
                      ))
                    ) : (
                      <li>No items</li>
                    )}
                  </ul>
                </td>
                <td>
                  {order.totalPrice ? order.totalPrice.toLocaleString() : "0"}{" "}
                  VND
                </td>
                <td>{order.status}</td>
                <td>{address}</td>
                <td>{phone}</td>
                <td>
                  {order.status === "Pending" && (
                    <>
                      <Button
                        variant="success"
                        className="me-2"
                        onClick={() =>
                          handlePurchase(order.id || order.orderId)
                        }
                      >
                        Purchase
                      </Button>
                      {/* <Button
                        variant="danger"
                        onClick={() => handleCancel(order.id || order.orderId)}
                      >
                        Cancel
                      </Button> */}
                    </>
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
