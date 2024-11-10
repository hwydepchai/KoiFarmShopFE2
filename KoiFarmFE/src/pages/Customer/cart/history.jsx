import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const History = () => {
  const [orders, setOrders] = useState([]);
  const [koiDetails, setKoiDetails] = useState({});
  const [koiFishyDetails, setKoiFishyDetails] = useState({});
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    if (!userId) {
      console.error("No user ID found in localStorage. Redirecting to login.");
      return;
    }

    axios.get("https://localhost:7229/api/Order").then((response) => {
      const fetchedOrders = response.data.$values;
      const userOrders = fetchedOrders.filter(
        (order) => order.accountId === userId
      );
      setOrders(userOrders);

      userOrders.forEach((order) => {
        if (order.koiId != null) {
          axios
            .get(`https://localhost:7229/api/KoiFish/${order.koiId}`)
            .then((response) => {
              setKoiDetails((prevKoiDetails) => ({
                ...prevKoiDetails,
                [order.koiId]: response.data,
              }));
            });
        } else {
          axios
            .get(`https://localhost:7229/api/KoiFishy/${order.koiFishyId}`)
            .then((response) => {
              setKoiFishyDetails((prevKoiFishyDetails) => ({
                ...prevKoiFishyDetails,
                [order.koiFishyId]: response.data,
              }));
            });
        }
      });
    });
  }, []);

  const historyOrders = orders.filter(
    (order) =>
      order.status === "Paid" ||
      order.status === "Cancelled" ||
      order.status === "Deleted"
  );

  // Navigate to feedback page
  const goToFeedbackPage = () => {
    navigate("/feedback");
  };

  return (
    <Container>
      <div className="d-flex justify-content-between align-items-center my-4">
        <h2>Order History</h2>
        <Button variant="primary" onClick={goToFeedbackPage}>
          Feedback
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Order Type</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {historyOrders.map((order, index) => {
            const koi = koiDetails[order.koiId];
            const koiFishy = koiFishyDetails[order.koiFishyId];
            const species = koi
              ? koi.species
              : koiFishy
              ? `KoiFishy no ${koiFishy.id}`
              : "Loading...";
            const price = koi
              ? koi.price
              : koiFishy
              ? koiFishy.price
              : "Loading...";

            return (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{species}</td>
                <td>{price}</td>
                <td>{order.status}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Container>
  );
};

export default History;
