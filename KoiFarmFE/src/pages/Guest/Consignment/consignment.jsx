// src/ConsignmentList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const ConsignmentList = () => {
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchConsignments = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7229/api/Consignments"
        );
        setConsignments(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching consignments data");
        setLoading(false);
      }
    };
    fetchConsignments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Consignment List</h1>
      <ul>
        {consignments.map((consignment) => (
          <li
            key={consignment.id}
            style={{
              marginBottom: "20px",
              border: "1px solid #ddd",
              padding: "10px",
            }}
          >
            <h3>Consignment ID: {consignment.id}</h3>
            <p>
              <strong>Account ID:</strong> {consignment.accountId}
            </p>
            <p>
              <strong>Koi ID:</strong> {consignment.koiId}
            </p>
            <p>
              <strong>Payment ID:</strong> {consignment.paymentId}
            </p>
            <p>
              <strong>Status:</strong> {consignment.status}
            </p>
            <p>
              <strong>Start Time:</strong>{" "}
              {new Date(consignment.startTime).toLocaleString()}
            </p>
            <p>
              <strong>End Time:</strong>{" "}
              {new Date(consignment.endTime).toLocaleString()}
            </p>
            <p>
              <strong>Created Date:</strong>{" "}
              {new Date(consignment.createdDate).toLocaleString()}
            </p>
            <p>
              <strong>Modified Date:</strong>{" "}
              {new Date(consignment.modifiedDate).toLocaleString()}
            </p>
            {consignment.deletedDate ? (
              <p>
                <strong>Deleted Date:</strong>{" "}
                {new Date(consignment.deletedDate).toLocaleString()}
              </p>
            ) : (
              <p>
                <strong>Deleted Date:</strong> None
              </p>
            )}
            <p>
              <strong>Is Deleted:</strong>{" "}
              {consignment.isDeleted ? "Yes" : "No"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConsignmentList;
