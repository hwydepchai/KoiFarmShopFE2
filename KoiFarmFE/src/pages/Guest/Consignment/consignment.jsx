import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DetailsConsign from "./DetailsConsign";
import CreateConsignment from "./CreateConsignment";

const UserConsignment = () => {
  const navigate = useNavigate();
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    fetchUserConsignments();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchUserConsignments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `https://localhost:7229/api/Consignments`,
        config
      );

      if (response.data && response.data.$values) {
        const userConsignments = response.data.$values.filter(
          (cons) => cons.accountId === userData.userId
        );

        // Check and create orders for newly approved consignments
        for (const consignment of userConsignments) {
          if (consignment.status === "Active") {
            try {
              const orderResponse = await axios.get(
                "https://localhost:7229/api/Order",
                config
              );
              const existingOrder = orderResponse.data.$values.find(
                (order) => order.consignmentId === consignment.id
              );

              if (!existingOrder) {
                const orderData = {
                  consignmentId: consignment.id,
                  accountId: userData.userId,
                  type: true, // `true` để đánh dấu đây là Order liên quan đến consignment
                  price: consignment.price || 0, // Giá chỉ mang tính tham khảo
                  status: "Pending",
                };

                await axios.post(
                  "https://localhost:7229/api/Order",
                  orderData,
                  config
                );
                showAlert("Order created for active consignment.");
              }
            } catch (error) {
              console.error("Error checking/creating order:", error);
            }
          }
        }

        setConsignments(userConsignments);
      }
    } catch (error) {
      console.error("Error fetching consignments:", error);
      showAlert("Error fetching consignments", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (consignment) => {
    setSelectedConsignment(consignment);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {alert && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">My Consignments</h5>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} className="me-2" />
              New Consignment
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Size (cm)</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consignments.map((consignment) => (
                  <tr key={consignment.id}>
                    <td>{consignment.name}</td>
                    <td>{consignment.gender}</td>
                    <td>{consignment.size} cm</td>
                    <td>
                      <Badge
                        bg={
                          consignment.status === "Active"
                            ? "success"
                            : consignment.status === "Pending"
                            ? "warning"
                            : "secondary"
                        }
                        className="rounded-pill"
                      >
                        {consignment.status}
                      </Badge>
                    </td>
                    <td>
                      {new Date(consignment.createdDate).toLocaleDateString()}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(consignment)}
                      >
                        <Eye size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {consignments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No consignments found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Create Consignment Modal */}
      <CreateConsignment
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onConsignmentCreated={fetchUserConsignments}
        showAlert={showAlert}
      />

      {/* Details Consignment Modal */}
      <DetailsConsign
        consignmentId={selectedConsignment?.id}
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
      />
    </Container>
  );
};

export default UserConsignment;
