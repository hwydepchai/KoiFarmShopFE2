/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import "./payment.css";

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
  const vnp_PayDate = new Date(queryParams.get("vnp_PayDate")).toLocaleString(); // Format the date
  const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
  const vnp_TmnCode = queryParams.get("vnp_TmnCode");
  const vnp_TransactionNo = queryParams.get("vnp_TransactionNo");
  const vnp_TransactionStatus = queryParams.get("vnp_TransactionStatus");
  const vnp_TxnRef = queryParams.get("vnp_TxnRef");

  // Function to update order status
  const updateOrderStatus = async (orderId) => {
    try {
      // Fetch the current order details
      const response = await fetch(`https://localhost:7229/api/Order/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }
      const currentOrderDetails = await response.json();

      // Prepare updated order details
      const updatedOrderDetails = {
        ...currentOrderDetails,
        status: "Completed", // Update status to Completed
      };

      // Send the updated order details back to the server
      const updateResponse = await fetch(
        `https://localhost:7229/api/Order/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedOrderDetails),
        }
      );

      if (!updateResponse.ok) {
        throw new Error("Failed to update order status");
      }

      console.log("Order status updated successfully");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  useEffect(() => {
    if (vnp_TransactionStatus === "00" && vnp_TxnRef) {
      updateOrderStatus(vnp_TxnRef); // Assuming vnp_TxnRef is the order ID
    }
  }, [vnp_TransactionStatus, vnp_TxnRef]);

  return (
    <Container className="mt-5">
      <div className="d-flex text-center justify-content-center">
        <h1 className="success text-center">
          {vnp_TransactionStatus === "00"
            ? "Payment Successful"
            : "Payment Details"}
        </h1>
        <span>
          <img
            src="https://media.istockphoto.com/id/1416145560/vector/green-circle-with-green-tick-flat-ok-sticker-icon-green-check-mark-icon-tick-symbol-in-green.jpg?s=612x612&w=0&k=20&c=Uh3KS7c_o5QmrfisyV-aRzDUNqtAM7QUVJrc8bniVsQ="
            alt="Payment Status"
          />
        </span>
      </div>
      <br />
      <div>
        <h2 className="text-center">Detailed</h2>
        <div>
          <p>
            <strong>Amount:</strong> {vnp_Amount}
          </p>
          <p>
            <strong>Bank Code:</strong> {vnp_BankCode}
          </p>
          <p>
            <strong>Bank Transaction No:</strong> {vnp_BankTranNo}
          </p>
          <p>
            <strong>Card Type:</strong> {vnp_CardType}
          </p>
          <p>
            <strong>Order Info:</strong> {vnp_OrderInfo}
          </p>
          <p>
            <strong>Payment Date:</strong> {vnp_PayDate}
          </p>
          <p>
            <strong>Transaction Reference:</strong> {vnp_TxnRef}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            {vnp_TransactionStatus === "00" ? "Success" : "Failed"}
          </p>
        </div>
      </div>
    </Container>
  );
};

export default PaymentReturn;
