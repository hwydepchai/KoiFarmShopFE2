/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Container } from "react-bootstrap";

const History = () => {
  const [orders, setOrders] = useState([]);
  const [koiDetails, setKoiDetails] = useState({});
  const [koiFishyDetails, setKoiFishyDetails] = useState({});

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

  return (
    <Container>
      <h2 className="my-4">Order History</h2>

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
                <td>{price} VND</td>
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
