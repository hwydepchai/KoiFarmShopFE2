import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import axios from "axios";

const PaymentReturn = () => {
  const location = useLocation();

  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);

  // Lấy các tham số cần thiết
  const vnp_ResponseCode = queryParams.get("vnp_ResponseCode");
  const vnp_TxnRef = queryParams.get("vnp_TxnRef").split("_")[0]; // Lấy phần trước dấu "_"
  const vnp_SecureHash = queryParams.get("vnp_SecureHash");

  // Hàm gửi dữ liệu đến API backend
  const sendDataToApi = async () => {
    try {
      const payload = {
        vnp_TxnRef,
        vnp_ResponseCode,
        vnp_SecureHash,
      };

      console.log("vnp_ResponseCode:", vnp_ResponseCode);
      console.log("vnp_TxnRef:", vnp_TxnRef);
      console.log("vnp_SecureHash:", vnp_SecureHash);

      console.log("Payload sent to API:", payload);
  
      const response = await fetch(`https://localhost:7229/api/Payment/return?vnp_TxnRef=${vnp_TxnRef}&vnp_ResponseCode=${vnp_ResponseCode}&vnp_SecureHash=${vnp_SecureHash}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
  
      if (response.status === 200) {
        console.log("API response:", response.data);
      } else {
        console.error("Failed to send data to API");
      }
    } catch (error) {
      console.error("Error sending data to API:", error);
    }
  };

  // Gọi API khi component load
  useEffect(() => {
    if (vnp_ResponseCode === "00" && vnp_TxnRef && vnp_SecureHash) {
      sendDataToApi();
    }
  }, [vnp_ResponseCode, vnp_TxnRef, vnp_SecureHash]);

  return (
    <Container className="mt-5">
      <h1 className="text-center">
        {vnp_ResponseCode === "00" ? "Payment Successful" : "Payment Failed"}
      </h1>
    </Container>
  );
};

export default PaymentReturn;
