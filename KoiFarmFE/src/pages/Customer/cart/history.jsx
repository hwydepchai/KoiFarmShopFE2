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
            (order.status === "Canceled" ||
              order.status === "Completed" ||
              order.status === "Paid" ||
              order.status === "Deleted")
        );

        const ordersWithDetails = await Promise.all(
          userOrders.map(async (order) => {
            try {
              if (order.koiId) {
                const koiResponse = await axios.get(
                  `https://localhost:7229/api/KoiFish/${order.koiId}`,
                  config
                );
                return {
                  ...order,
                  price: koiResponse.data.price || order.price,
                  species: koiResponse.data.species,
                };
              } else if (order.koiFishyId) {
                const fishyResponse = await axios.get(
                  `https://localhost:7229/api/KoiFishy/${order.koiFishyId}`,
                  config
                );
                return {
                  ...order,
                  price: fishyResponse.data.price || order.price,
                  species: `KoiFishy #${fishyResponse.data.id}`,
                };
              }
              return order;
            } catch (err) {
              console.error("Error fetching details:", err);
              return {
                ...order,
                species: "Unknown Species",
              };
            }
          })
        );

        setOrders(ordersWithDetails);
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
                <th>Species</th>
                <th>Price (VND)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <td>{index + 1}</td>
                  <td>{order.species || "Unknown Species"}</td>
                  <td>{(order.price || 0).toLocaleString()}</td>
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
