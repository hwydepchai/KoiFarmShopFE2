/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch the orders and enrich them with account names and koi species
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://localhost:7229/api/Order");
        const data = await response.json();
        const orders = data.$values;

        // Map through each order and fetch account and koi details
        const enrichedOrders = await Promise.all(
          orders.map(async (order) => {
            const accountResponse = await fetch(`https://localhost:7229/api/Accounts/${order.accountId}`);
            const accountData = await accountResponse.json();
            
            const koiResponse = await fetch(`https://localhost:7229/api/KoiFish/${order.koiId}`);
            const koiData = await koiResponse.json();

            return {
              ...order,
              accountName: accountData.name, // Add account name
              koiSpecies: koiData.species,   // Add koi species
            };
          })
        );

        setOrderList(enrichedOrders);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchOrders();
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
            <th scope="col">Koi Species</th>
            <th scope="col">KoiFishyId</th> 
            <th scope="col">Account Name</th>
            <th scope="col">Price (VND)</th>
            <th scope="col">Status</th>
            <th scope="col">Created Date</th>
            <th scope="col">Modified Date</th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.koiSpecies || ""}</td>
              <td>{order.koiFishyId || ""}</td> 
              <td>{order.accountName || "N/A"}</td>
              <td>{order.price}</td>
              <td>{order.status || "N/A"}</td>
              <td>{order.createdDate ? new Date(order.createdDate).toLocaleDateString() : "N/A"}</td>
              <td>{order.modifiedDate ? new Date(order.modifiedDate).toLocaleDateString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
