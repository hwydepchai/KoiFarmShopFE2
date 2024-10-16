/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import Account from "../../components/account/accountComponent";

const AccountPage = () => {
  const [accounts, setAccounts] = useState({ active: [], deleted: [] });
  const [newAccount, setNewAccount] = useState({ email: "", password: "" });

  // Fetch accounts on page load
  useEffect(() => {
    fetchAccounts();
  }, []);

  // Fetch all accounts
  const fetchAccounts = async () => {
    try {
      const response = await axios.get("https://localhost:7229/api/Accounts");
      const accountData = response.data;

      // Cast account data to Account objects
      const accountsList = accountData.map(
        (item) =>
          new Account(
            item.id,
            item.name,
            item.roleId,
            item.gender,
            item.email,
            item.password,
            item.phone,
            item.address,
            item.dateOfBirth,
            item.point,
            item.status,
            item.createdDate,
            item.modifiedDate,
            item.deletedDate,
            item.isDeleted,
            item.consignments,
            item.feedbacks,
            item.orders,
            item.role
          )
      );

      // Filter active and deleted accounts
      const activeAccounts = accountsList.filter(
        (account) => !account.isDeleted
      );
      const deletedAccounts = accountsList.filter(
        (account) => account.isDeleted
      );

      setAccounts({ active: activeAccounts, deleted: deletedAccounts });
    } catch (error) {
      console.error("Error fetching accounts:", error);
    }
  };

  const AccountTable = ({ accounts, title }) => {
    return (
      <div>
        <h2>{title}</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Name
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Email
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Phone
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Status
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {account.id}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {account.name}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {account.email}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {account.phone}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {account.status}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  <button onClick={() => updateAccount(account.id)}>
                    Update
                  </button>
                  {!account.isDeleted && (
                    <button onClick={() => deleteAccount(account.id)}>
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  AccountTable.propTypes = {
    accounts: PropTypes.array.isRequired, // accounts should be an array
    title: PropTypes.string.isRequired, // title should be a string
  };

  // Create a new account
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

  // Delete an account
  const deleteAccount = async (id) => {
    try {
      await axios.delete(`https://localhost:7229/api/Accounts/${id}`);
      fetchAccounts(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const updateAccount = async (id) => {
    try {
      await axios.put(`https://localhost:7229/api/Accounts/${id}`);
      fetchAccounts(); // Refresh the list
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div>
      <h1>Account Management</h1>

      {/* Form to create a new account */}
      <form onSubmit={createAccount}>
        <input
          type="email"
          placeholder="Email"
          value={newAccount.email}
          onChange={(e) =>
            setNewAccount({ ...newAccount, email: e.target.value })
          }
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newAccount.password}
          onChange={(e) =>
            setNewAccount({ ...newAccount, password: e.target.value })
          }
          required
        />
        <button type="submit">Create Account</button>
      </form>

      {/* Active Accounts Table */}
      <AccountTable accounts={accounts.active} title="Active Accounts" />
      {/* Deleted Accounts Table */}
      <AccountTable accounts={accounts.deleted} title="Deleted Accounts" />
    </div>
  );
};

export default AccountPage;
