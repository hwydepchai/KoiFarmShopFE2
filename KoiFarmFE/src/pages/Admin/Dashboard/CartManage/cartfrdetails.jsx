/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CartDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    axios.get(`https://localhost:7229/api/Cart/${id}`)
      .then((response) => {
        setItem(response.data);
      })
      .catch((error) => console.error('Error fetching item details:', error));
  }, [id]);

  if (!item) return <p>Loading item details...</p>;

  return (
    <div className="container my-4">
      <h2>Cart Item Details</h2>
      <p><strong>Item ID:</strong> {item.id}</p>
      <p><strong>Price:</strong> ${item.price}</p>
      <p><strong>Total Price:</strong> ${item.totalPrice}</p>
      <p><strong>Quantity:</strong> {item.quantity}</p>
      <p><strong>Status:</strong> {item.status}</p>
      <p><strong>Created Date:</strong> {new Date(item.createdDate).toLocaleDateString()}</p>
      <p><strong>Modified Date:</strong> {new Date(item.modifiedDate).toLocaleDateString()}</p>
    </div>
  );
};

export default CartDetails;
