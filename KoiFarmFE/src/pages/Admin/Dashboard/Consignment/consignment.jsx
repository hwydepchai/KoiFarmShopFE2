import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Spinner } from "react-bootstrap";
import { Pencil } from "lucide-react";
import EditConsignmentModal from "./EditConsignmentModal";

const ConsignmentManagement = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);

  useEffect(() => {
    fetchConsignments();
  }, []);

  const fetchConsignments = async () => {
    try {
      const response = await fetch("https://localhost:7229/api/Consignments");
      const data = await response.json();

      const processedData = data.$values.map((item) => ({
        ...item,
        price: item.price || 0,
      }));

      setConsignments(processedData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching consignments:", error);
      setLoading(false);
    }
  };

  const handleEdit = (consignment) => {
    setSelectedConsignment(consignment);
    setShowEditModal(true);
  };

  const handleSave = async (formData) => {
    try {
      const response = await fetch(
        `https://localhost:7229/api/Consignments/${selectedConsignment.id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        setShowEditModal(false);
        fetchConsignments();
      } else {
        console.error("Failed to save consignment:", await response.text());
      }
    } catch (error) {
      console.error("Error saving consignment:", error);
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
      <h2 className="mb-4">Consignment Management</h2>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Year Of Birth</th>
            <th>Gender</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {consignments.map((consignment) => (
            <tr key={consignment.id}>
              <td>{consignment.id}</td>
              <td>{consignment.name}</td>
              <td>{consignment.yearOfBirth}</td>
              <td>{consignment.gender}</td>
              <td>
                {new Intl.NumberFormat("vi-VN").format(consignment.price)} VND
              </td>
              <td>
                <Badge
                  bg={
                    consignment.status?.toLowerCase() === "active"
                      ? "success"
                      : consignment.status?.toLowerCase() === "pending"
                      ? "secondary"
                      : "danger"
                  }
                >
                  {consignment.status || "N/A"}
                </Badge>
              </td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(consignment)}
                >
                  <Pencil size={16} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedConsignment && (
        <EditConsignmentModal
          show={showEditModal}
          handleClose={() => setShowEditModal(false)}
          consignment={selectedConsignment}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ConsignmentManagement;
