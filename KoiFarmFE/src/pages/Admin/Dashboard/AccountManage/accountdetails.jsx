/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

function AccountDetails() {
  const { id } = useParams(); // Get the ID from the route parameters
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the account details from the API
  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `https://localhost:7229/api/Accounts/${id}`
        );
        setAccountDetails(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching account details:", error);
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [id]);

  const handleEdit = (id) => {
    console.log(`Edit account with ID: ${id}`);
    // Add your edit logic here
  };

  const handleDelete = (id) => {
    console.log(`Delete account with ID: ${id}`);
    // Add your delete logic here
  };

  // Display loading state or the account details once fetched
  if (loading) {
    return <p>Loading account details...</p>;
  }

  if (!accountDetails) {
    return <p>No account details found</p>;
  }

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Account Details</h2>
      <div className="d-flex justify-content-around">

        {/* General Information Section */}
        <div className="card mb-4 flex-grow-1">
          <div className="card-header">
            <h5 className="card-title">General Info</h5>
          </div>
          <div className="card-body">
            <p className="card-text">
              <strong>ID:</strong> #{accountDetails.id}
            </p>
            <p className="card-text">
              <strong>Name:</strong> {accountDetails.name}
            </p>
            <p className="card-text">
              <strong>Email:</strong> {accountDetails.email}
            </p>
            <p className="card-text">
              <strong>Phone:</strong> {accountDetails.phone}
            </p>
            <p className="card-text">
              <strong>Address:</strong> {accountDetails.address}
            </p>
            <p className="card-text">
              <strong>Date of Birth:</strong>{" "}
              {new Date(accountDetails.dateOfBirth).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Account Stats Section */}
        <div className="card mb-4 flex-grow-1">
          <div className="card-header">
            <h5 className="card-title">Account Stats</h5>
          </div>
          <div className="card-body">
            <p className="card-text">
              <strong>Role ID:</strong> {accountDetails.roleId}
            </p>
            <p className="card-text">
              <strong>Points:</strong> {accountDetails.point}
            </p>
            <p className="card-text">
              <strong>Status:</strong> {accountDetails.status}
            </p>
            <p className="card-text">
              <strong>Created Date:</strong>{" "}
              {new Date(accountDetails.createdDate).toLocaleDateString()}
            </p>
            <p className="card-text">
              <strong>Last Modified:</strong>{" "}
              {new Date(accountDetails.modifiedDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="card-title">Actions</h5>
          </div>
          <div className="card-body d-flex flex-column justify-content-between">
            <button
              className="btn btn-primary"
              onClick={() => handleEdit(accountDetails.id)}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => handleDelete(accountDetails.id)}
            >
              🗑️ Delete
            </button>
            <Link to="/dashboard/accounts" className="btn btn-secondary">
              Back to List
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDetails;
