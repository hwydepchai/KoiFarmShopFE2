/* eslint-disable no-unused-vars */
import React, {useState} from 'react';
import axios from "axios";

function accountcreate() {
    const [newAccount, setNewAccount] = useState({ email: "", password: "" });
    
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
  return (
    <div>accountcreate</div>
  )
}

export default accountcreate