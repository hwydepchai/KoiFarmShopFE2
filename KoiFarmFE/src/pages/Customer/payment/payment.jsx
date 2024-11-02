/* eslint-disable no-unused-vars */
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

const PaymentReturn = () => {
  const location = useLocation();
  
  // Create a URLSearchParams object to parse the query parameters
  const queryParams = new URLSearchParams(location.search);
  
  // Extract parameters
  const vnp_Amount = queryParams.get('vnp_Amount');
  const vnp_BankCode = queryParams.get('vnp_BankCode');
  const vnp_BankTranNo = queryParams.get('vnp_BankTranNo');
  const vnp_CardType = queryParams.get('vnp_CardType');
  const vnp_OrderInfo = queryParams.get('vnp_OrderInfo');
  const vnp_PayDate = queryParams.get('vnp_PayDate');
  const vnp_ResponseCode = queryParams.get('vnp_ResponseCode');
  const vnp_TmnCode = queryParams.get('vnp_TmnCode');
  const vnp_TransactionNo = queryParams.get('vnp_TransactionNo');
  const vnp_TransactionStatus = queryParams.get('vnp_TransactionStatus');
  const vnp_TxnRef = queryParams.get('vnp_TxnRef');
  const vnp_SecureHash = queryParams.get('vnp_SecureHash');

  return (
    <Container className="mt-5">
      <h2>Payment Details</h2>
      <Card>
        <Card.Body>
          <Card.Title>Transaction Summary</Card.Title>
          <ul>
            <li><strong>Amount:</strong> {vnp_Amount} VND</li>
            <li><strong>Bank Code:</strong> {vnp_BankCode}</li>
            <li><strong>Transaction No:</strong> {vnp_TransactionNo}</li>
            <li><strong>Bank Transaction No:</strong> {vnp_BankTranNo}</li>
            <li><strong>Card Type:</strong> {vnp_CardType}</li>
            <li><strong>Order Info:</strong> {vnp_OrderInfo}</li>
            <li><strong>Payment Date:</strong> {vnp_PayDate}</li>
            <li><strong>Response Code:</strong> {vnp_ResponseCode}</li>
            <li><strong>Transaction Status:</strong> {vnp_TransactionStatus}</li>
            <li><strong>Transaction Reference:</strong> {vnp_TxnRef}</li>
            <li><strong>Secure Hash:</strong> {vnp_SecureHash}</li>
          </ul>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentReturn;
