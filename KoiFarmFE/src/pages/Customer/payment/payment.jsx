/* eslint-disable no-unused-vars */
import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Card } from "react-bootstrap";
import './payment.css'

const PaymentReturn = () => {
  const location = useLocation();

  // Create a URLSearchParams object to parse the query parameters
  const queryParams = new URLSearchParams(location.search);

  // Extract parameters
  const vnp_Amount = queryParams.get("vnp_Amount");
  const vnp_BankCode = queryParams.get("vnp_BankCode");
  const vnp_BankTranNo = queryParams.get("vnp_BankTranNo");
  const vnp_CardType = queryParams.get("vnp_CardType");
  const vnp_OrderInfo = queryParams.get("vnp_OrderInfo");
  const vnp_PayDate = queryParams.get("vnp_PayDate");
  const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
  const vnp_TmnCode = queryParams.get("vnp_TmnCode");
  const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
  const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");
  const vnp_TxnRef = queryParams.get("vnp_TxnRef");
  const vnp_SecureHash = queryParams.get("vnp_SecureHash");

  return (
    <Container className="mt-5 d-flex">
      <h1 className="success">
        {vnp_TransactionStatus === "00"
          ? "Payment Successful "
          : "Payment Details"}
      </h1>
      <span>
        <img src="https://media.istockphoto.com/id/1416145560/vector/green-circle-with-green-tick-flat-ok-sticker-icon-green-check-mark-icon-tick-symbol-in-green.jpg?s=612x612&w=0&k=20&c=Uh3KS7c_o5QmrfisyV-aRzDUNqtAM7QUVJrc8bniVsQ="></img>
      </span>
    </Container>
  );
};

export default PaymentReturn;
