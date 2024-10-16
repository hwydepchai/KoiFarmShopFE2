import { useState, useEffect } from "react";
import axios from "axios";

const OrderList = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:7229/api/Order")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Error fetching Order data:", error));
  }, []);

  return (
    <div>
      <h5>Order List</h5>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>Order #{order.id}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;
