import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge, Spinner } from "react-bootstrap";
import { Plus } from "lucide-react";

const PromotionManagement = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state for create
  const [createForm, setCreateForm] = useState({
    point: "",
    discountPercentage: "",
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch("https://localhost:7229/api/Promotion");
      const data = await response.json();
      setPromotions(data.$values);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7229/api/Promotion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          point: Number(createForm.point),
          discountPercentage: Number(createForm.discountPercentage),
        }),
      });

      if (response.ok) {
        setShowCreateModal(false);
        setCreateForm({ point: "", discountPercentage: "" });
        fetchPromotions();
      }
    } catch (error) {
      console.error("Error creating promotion:", error);
    }
  };

  const getStatusBadgeVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "valid":
        return "success";
      case "inactive":
        return "secondary";
      case "expired":
        return "danger";
      default:
        return "warning";
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Promotion Management</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          <Plus size={16} className="me-2" />
          Add New Promotion
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Points Required</th>
            <th>Discount (%)</th>
            <th>Status</th>
            <th>Created Date</th>
          </tr>
        </thead>
        <tbody>
          {promotions.map((promotion) => (
            <tr key={promotion.id}>
              <td>{promotion.id}</td>
              <td>{promotion.point}</td>
              <td>{promotion.discountPercentage}%</td>
              <td>
                <Badge bg={getStatusBadgeVariant(promotion.status)}>
                  {promotion.status}
                </Badge>
              </td>
              <td>{new Date(promotion.createdDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Create Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Promotion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreate}>
            <Form.Group className="mb-3">
              <Form.Label>Points Required</Form.Label>
              <Form.Control
                type="number"
                value={createForm.point}
                onChange={(e) =>
                  setCreateForm({ ...createForm, point: e.target.value })
                }
                required
                min="0"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Percentage</Form.Label>
              <Form.Control
                type="number"
                value={createForm.discountPercentage}
                onChange={(e) =>
                  setCreateForm({
                    ...createForm,
                    discountPercentage: e.target.value,
                  })
                }
                required
                min="0"
                max="100"
                step="0.1"
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create Promotion
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default PromotionManagement;
