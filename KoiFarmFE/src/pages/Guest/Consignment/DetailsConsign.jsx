import React, { useState, useEffect } from "react";
import { Modal, Badge, Spinner } from "react-bootstrap";
import axios from "axios";

const DetailsConsign = ({ consignmentId, show, onHide }) => {
  const [consignment, setConsignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchConsignmentDetails = async () => {
      if (!consignmentId) return;

      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(
          `https://localhost:7229/api/Consignments/${consignmentId}`,
          config
        );
        setConsignment(response.data);
      } catch (error) {
        console.error("Error fetching consignment details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConsignmentDetails();
  }, [consignmentId]);

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Body className="text-center">
          <Spinner animation="border" variant="primary" />
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Consignment Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {consignment ? (
          <div>
            <p>
              <strong>Name:</strong> {consignment.name}
            </p>
            <p>
              <strong>Year of Birth:</strong> {consignment.yearOfBirth}
            </p>
            <p>
              <strong>Gender:</strong> {consignment.gender}
            </p>
            <p>
              <strong>Origin:</strong> {consignment.origin}
            </p>
            <p>
              <strong>Variety:</strong> {consignment.variety}
            </p>
            <p>
              <strong>Character:</strong> {consignment.character}
            </p>
            <p>
              <strong>Size:</strong> {consignment.size} cm
            </p>
            <p>
              <strong>Amount of Food:</strong> {consignment.amountFood} kg
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <Badge
                bg={
                  consignment.status === "Active"
                    ? "success"
                    : consignment.status === "Pending"
                    ? "warning"
                    : "secondary"
                }
              >
                {consignment.status}
              </Badge>
            </p>
            {consignment.images && consignment.images.$values.length > 0 ? (
              <img
                src={consignment.images.$values[0].urlPath}
                alt="Koi"
                className="img-fluid rounded"
                style={{ maxHeight: "300px", objectFit: "contain" }}
              />
            ) : (
              <p>No image available</p>
            )}
          </div>
        ) : (
          <p>Consignment details not found.</p>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DetailsConsign;