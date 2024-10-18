/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://localhost:7229/api/Order") // Fetch list of orders from API
      .then((response) => response.json())
      .then((data) => {
        setOrderList(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Order List</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Koi ID</th>
            <th scope="col">Price</th>
            <th scope="col">Status</th>
            <th scope="col">Created Date</th>
            <th scope="col">Modified Date</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.koiId}</td>
              <td>${order.price}</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdDate).toLocaleDateString()}</td>
              <td>{new Date(order.modifiedDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
