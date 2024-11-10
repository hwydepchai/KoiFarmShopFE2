/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";

function OrderList() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://localhost:7229/api/Order");
        const data = await response.json();
        const orders = data.$values;

        const enrichedOrders = await Promise.all(
          orders.map(async (order) => {
            const accountResponse = await fetch(`https://localhost:7229/api/Accounts/${order.accountId}`);
            const accountData = await accountResponse.json();

            const koiResponse = await fetch(`https://localhost:7229/api/KoiFish/${order.koiId}`);
            const koiData = await koiResponse.json();

            return {
              ...order,
              accountName: accountData.name,
              koiSpecies: koiData.species,
              koiFishyId: order.koiFishyId, // Keeping koiFishyId for display purpose
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

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    
    const sortedOrders = [...orderList].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setOrderList(sortedOrders);
    setSortConfig({ key, direction });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Order List</h2>
      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th
              scope="col"
              onClick={() => handleSort("id")}
              style={{ cursor: "pointer" }}
            >
              Order ID
              {sortConfig.key === "id"
                ? sortConfig.direction === "asc"
                  ? " ↑"
                  : " ↓"
                : ""}
            </th>
            <th
              scope="col"
              onClick={() => handleSort("koiSpecies")}
              style={{ cursor: "pointer" }}
            >
              Koi Information
              {sortConfig.key === "koiSpecies"
                ? sortConfig.direction === "asc"
                  ? " ↑"
                  : " ↓"
                : ""}
            </th>
            <th
              scope="col"
              onClick={() => handleSort("accountName")}
              style={{ cursor: "pointer" }}
            >
              Account Name
              {sortConfig.key === "accountName"
                ? sortConfig.direction === "asc"
                  ? " ↑"
                  : " ↓"
                : ""}
            </th>
            <th
              scope="col"
              onClick={() => handleSort("price")}
              style={{ cursor: "pointer" }}
            >
              Price (VND)
              {sortConfig.key === "price"
                ? sortConfig.direction === "asc"
                  ? " ↑"
                  : " ↓"
                : ""}
            </th>
            <th
              scope="col"
              onClick={() => handleSort("status")}
              style={{ cursor: "pointer" }}
            >
              Status
              {sortConfig.key === "status"
                ? sortConfig.direction === "asc"
                  ? " ↑"
                  : " ↓"
                : ""}
            </th>
            <th
              scope="col"
              onClick={() => handleSort("createdDate")}
              style={{ cursor: "pointer" }}
            >
              Created Date
              {sortConfig.key === "createdDate"
                ? sortConfig.direction === "asc"
                  ? " ↑"
                  : " ↓"
                : ""}
            </th>
            <th
              scope="col"
              onClick={() => handleSort("modifiedDate")}
              style={{ cursor: "pointer" }}
            >
              Modified Date
              {sortConfig.key === "modifiedDate"
                ? sortConfig.direction === "asc"
                  ? " ↑"
                  : " ↓"
                : ""}
            </th>
          </tr>
        </thead>
        <tbody>
          {orderList.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                {order.koiId != null
                  ? order.koiSpecies || "N/A"
                  : `Koi Fishy no ${order.koiFishyId}`}
              </td>
              <td>{order.accountName || "N/A"}</td>
              <td>{order.price}</td>
              <td>{order.status || "N/A"}</td>
              <td>
                {order.createdDate
                  ? new Date(order.createdDate).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>
                {order.modifiedDate
                  ? new Date(order.modifiedDate).toLocaleDateString()
                  : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderList;
