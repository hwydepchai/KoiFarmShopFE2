import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge, Spinner } from "react-bootstrap";
import { Trash2, Pencil, UploadCloud } from "lucide-react";

const ConsignmentManagement = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form state
  const [editForm, setEditForm] = useState({
    price: "",
    status: "",
    img: null,
  });

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      const response = await fetch("https://localhost:7229/api/Consignments");
      const data = await response.json();
      setConsignments(data.$values);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching consignments:", error);
      setLoading(false);
    }
  };

  const handleEdit = (consignment) => {
    setSelectedConsignment(consignment);
    setEditForm({
      price: consignment.price,
      status: consignment.status,
      img: null,
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this consignment?")) {
      try {
        await fetch(`https://localhost:7229/api/Consignments/${id}`, {
          method: "DELETE",
        });
        fetchConsignments(); // Refresh the list
      } catch (error) {
        console.error("Error deleting consignment:", error);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("price", editForm.price);
    formData.append("status", editForm.status);
    if (selectedFile) {
      formData.append("img", selectedFile);
    }

    try {
      await fetch(
        `https://localhost:7229/api/Consignments/${selectedConsignment.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      setShowEditModal(false);
      fetchConsignments(); // Refresh the list
    } catch (error) {
      console.error("Error updating consignment:", error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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
      <h2 className="mb-4">Consignment Management</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Account ID</th>
            <th>Koi ID</th>
            <th>Price</th>
            <th>Status</th>
            <th>Created Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {consignments.map((consignment) => (
            <tr key={consignment.id}>
              <td>{consignment.id}</td>
              <td>{consignment.accountId}</td>
              <td>{consignment.koiId}</td>
              <td>${consignment.price.toLocaleString()}</td>
              <td>
                <Badge
                  bg={
                    consignment.status.toLowerCase() === "active"
                      ? "success"
                      : "secondary"
                  }
                >
                  {consignment.status || "N/A"}
                </Badge>
              </td>
              <td>{new Date(consignment.createdDate).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(consignment)}
                >
                  <Pencil size={16} />
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(consignment.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Consignment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                value={editForm.price}
                onChange={(e) =>
                  setEditForm({ ...editForm, price: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editForm.status}
                onChange={(e) =>
                  setEditForm({ ...editForm, status: e.target.value })
                }
              >
                <option value="">Select Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <div className="d-flex align-items-center">
                <Form.Control
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <UploadCloud size={20} className="ms-2 text-primary" />
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ConsignmentManagement;
