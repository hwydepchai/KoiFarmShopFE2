import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Container,
  Button,
  Spinner,
  Badge,
  Card,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!user?.userId) {
      navigate("/login");
      return;
    }
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.get(
        "https://localhost:7229/api/Order",
        config
      );

      if (response.data && response.data.$values) {
        const userOrders = response.data.$values.filter(
          (order) =>
            order.accountId === user.userId &&
            ["Canceled", "Completed", "Paid", "Deleted"].includes(order.status)
        );

        // Không cần biến `ordersWithDetails`, gán trực tiếp vào state
        setOrders(userOrders);
      }
    } catch (error) {
      console.error("Error fetching order history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <h2 className="h5 mb-0">Order History</h2>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate("/feedback")}
            >
              Feedback
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <Table responsive hover className="mb-0">
            <thead className="bg-light">
              <tr>
                <th>#</th>
                <th>Order Items</th>
                <th>Total Price (VND)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.orderId}>
                  <td>{index + 1}</td>
                  <td>
                    <ul>
                      {order.items?.$values &&
                      order.items.$values.length > 0 ? (
                        order.items.$values.map((item, i) => (
                          <li key={i}>
                            {item.name}: {item.price.toLocaleString()} VND
                          </li>
                        ))
                      ) : (
                        <li>No items</li>
                      )}
                    </ul>
                  </td>
                  <td>{(order.totalPrice || 0).toLocaleString()} VND</td>
                  <td>
                    <Badge
                      bg={
                        order.status === "Completed" || order.status === "Paid"
                          ? "success"
                          : order.status === "Canceled"
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {order.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No order history found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default History;
