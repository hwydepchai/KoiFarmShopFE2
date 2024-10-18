/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

function Settings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [theme, setTheme] = useState('light'); // Default theme is light
  const [paymentMethod, setPaymentMethod] = useState('credit-card'); // Default payment method

  const handleSave = (e) => {
    e.preventDefault();
    // Logic for saving settings goes here
    console.log('Settings saved', { name, email, password, theme, paymentMethod });
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Settings</h2>

      <form onSubmit={handleSave}>
        {/* Change Name */}
        <div className="mb-3">
          <label className="form-label">Change Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Enter your new name"
          />
        </div>

        {/* Change Email */}
        <div className="mb-3">
          <label className="form-label">Change Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your new email"
          />
        </div>

        {/* Change Password */}
        <div className="mb-3">
          <label className="form-label">Change Password</label>
          <input 
            type="password" 
            className="form-control" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter new password"
          />
        </div>

        {/* Select Theme */}
        <div className="mb-3">
          <label className="form-label">Select Theme</label>
          <select 
            className="form-select" 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        {/* Payment Method */}
        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <select 
            className="form-select" 
            value={paymentMethod} 
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="credit-card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="bank-transfer">Bank Transfer</option>
          </select>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <button type="submit" className="btn btn-primary">Save Settings</button>
        </div>
      </form>
    </div>
  );
}

export default Settings;
