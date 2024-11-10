import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Modal,
  Badge,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import axios from "axios";
import { Plus, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserConsignment = () => {
  const navigate = useNavigate();
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [createForm, setCreateForm] = useState({
    price: "",
  });

  // Get user data and token from localStorage once when component mounts
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Check for authentication
    if (!token || !userData) {
      navigate("/login");
      return;
    }

    // Initial fetch of consignments
    fetchUserConsignments();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const fetchUserConsignments = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `https://localhost:7229/api/Consignments`,
        config
      );
      if (response.data && response.data.$values) {
        const userConsignments = response.data.$values.filter(
          (cons) => cons.accountId === userData.userId
        );
        setConsignments(userConsignments);

        // Automatically create orders for consignments with "Active" status
        for (const consignment of userConsignments) {
          if (consignment.status === "Active") {
            await createOrderIfNotExists(consignment.id, consignment.price);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching consignments:", error);
      if (error.response?.status === 401) {
        navigate("/login");
      }
      showAlert("Error fetching consignments", "danger");
    } finally {
      setLoading(false);
    }
  };

  const createOrderIfNotExists = async (consignmentId, price) => {
    try {
      const response = await axios.get("https://localhost:7229/api/Order", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orders = response.data.$values || [];
      const existingOrder = orders.find(
        (order) =>
          order.consignmentId === consignmentId && order.status === "Pending"
      );

      // If no existing pending order for this consignment, create one
      if (!existingOrder) {
        await axios.post(
          "https://localhost:7229/api/Order",
          {
            consignmentId,
            accountId: userData.userId,
            price,
            status: "Pending",
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        showAlert("Order created for active consignment!");
      }
    } catch (error) {
      console.error("Error creating order for consignment:", error);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);

    try {
      const formData = new FormData();
      formData.append("accountId", userData.userId);
      formData.append("price", createForm.price);
      if (selectedFile) {
        formData.append("img", selectedFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "https://localhost:7229/api/Consignments",
        formData,
        config
      );

      if (response.data) {
        showAlert("Consignment created successfully!");
        setConsignments((prev) => [...prev, response.data]);
        setShowCreateModal(false);
        setCreateForm({ price: "" });
        setSelectedFile(null);
      }
    } catch (error) {
      console.error("Error creating consignment:", error);
      showAlert("Failed to create consignment", "danger");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleViewDetails = async (consignment) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `https://localhost:7229/api/Consignments/${consignment.id}`,
        config
      );

      if (response.data) {
        setSelectedConsignment(response.data);
        setShowDetailsModal(true);
      }
    } catch (error) {
      console.error("Error fetching consignment details:", error);
      showAlert("Failed to load consignment details", "danger");
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
                  <th>ID</th>
                  <th>Koi Code</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consignments.map((consignment) => (
                  <tr key={consignment.id}>
                    <td>{consignment.id}</td>
                    <td>{consignment.koiCode}</td>
                    <td>${consignment.price.toLocaleString()}</td>
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

      {/* Create Modal */}
      <Modal
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Create New Consignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={createForm.price}
                onChange={(e) => setCreateForm({ price: e.target.value })}
                required
                min="0"
                placeholder="Enter price"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Koi Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                accept="image/*"
                required
              />
              <Form.Text className="text-muted">
                Please upload a clear image of your koi
              </Form.Text>
            </Form.Group>

            <div className="d-grid">
              <Button type="submit" variant="primary" disabled={submitLoading}>
                {submitLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Creating...
                  </>
                ) : (
                  "Create Consignment"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Details Modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Consignment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedConsignment && (
            <Row>
              <Col md={6}>
                <p>
                  <strong>ID:</strong> {selectedConsignment.id}
                </p>
                <p>
                  <strong>Koi Code:</strong> {selectedConsignment.koiCode}
                </p>
                <p>
                  <strong>Price:</strong> $
                  {selectedConsignment.price.toLocaleString()}
                </p>
                <p>
                  <strong>Status:</strong>
                  <Badge
                    bg={
                      selectedConsignment.status === "Active"
                        ? "success"
                        : selectedConsignment.status === "Pending"
                        ? "warning"
                        : "secondary"
                    }
                    className="ms-2 rounded-pill"
                  >
                    {selectedConsignment.status}
                  </Badge>
                </p>
                <p>
                  <strong>Created Date:</strong>{" "}
                  {new Date(
                    selectedConsignment.createdDate
                  ).toLocaleDateString()}
                </p>
              </Col>
              <Col md={6}>
                {selectedConsignment.images?.$values?.length > 0 && (
                  <div>
                    <p>
                      <strong>Koi Image:</strong>
                    </p>
                    <img
                      src={selectedConsignment.images.$values[0].urlPath}
                      alt="Koi"
                      className="img-fluid rounded"
                      style={{ maxHeight: "300px", objectFit: "contain" }}
                    />
                  </div>
                )}
              </Col>
            </Row>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default UserConsignment;
