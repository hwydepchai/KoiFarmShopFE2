/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./account.css";

function AccountList() {
  const [accounts, setAccounts] = useState({ active: [], deleted: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newAccount, setNewAccount] = useState({ email: "", password: "" });

  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch accounts from the API
  const fetchAccounts = async () => {
    try {
      const response = await axios.get("https://localhost:7229/api/Accounts");
      const accountData = response.data.$values;

      // Filter accounts based on the `isDeleted` property
      const activeAccounts = accountData.filter((account) => !account.isDeleted);
      const deletedAccounts = accountData.filter((account) => account.isDeleted);

      setAccounts({ active: activeAccounts, deleted: deletedAccounts });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const createAccount = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://localhost:7229/api/Accounts", newAccount);
      setNewAccount({ email: "", password: "" });
      fetchAccounts(); // Refresh the list
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  // Helper function to render tables for both active and deleted accounts
  const AccountTable = ({ accounts, title }) => (
    <div>
      <h2>{title}</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Status</th>
            <th>Details</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.name}</td>
              <td>{account.email}</td>
              <td>{account.phone}</td>
              <td>{account.gender || "N/A"}</td>
              <td>{account.dateOfBirth ? new Date(account.dateOfBirth).toLocaleDateString() : "N/A"}</td>
              <td>{account.status}</td>
              <td>
                <Link to={`/dashboard/account/${account.id}`} className="btn btn-primary btn-sm">
                  View Details
                </Link>
              </td>
              <td>
                {!account.isDeleted ? (
                  <button onClick={() => deleteAccount(account.id)} className="btn">
                    <label className="switch">
                      <input type="checkbox"></input>
                      <span className="slider"></span>
                    </label>
                  </button>
                ) : (
                  <button onClick={() => toggleAccountStatus(account.id, false)} className="btn">
                    <label className="switch">
                      <input type="checkbox" checked></input>
                      <span className="slider"></span>
                    </label>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Function to delete an account (soft-delete)
  const deleteAccount = async (id) => {
    try {
      await axios.delete(`https://localhost:7229/api/Accounts/${id}`);
      fetchAccounts(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const toggleAccountStatus = async (id, isDeleted) => {
    try {
      await axios.put(`https://localhost:7229/api/Accounts/${id}/${isDeleted}`);
      fetchAccounts(); // Refresh the list after the update
    } catch (error) {
      console.error("Error updating account status:", error);
    }
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Account Management</h2>

      {/* Active Accounts Table */}
      <AccountTable accounts={accounts.active} title="Active Accounts" />

      {/* Deleted Accounts Table */}
      <AccountTable accounts={accounts.deleted} title="Deleted Accounts" />
    </div>
  );
}

export default AccountList;
