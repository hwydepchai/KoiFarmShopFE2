/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CartFr = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://localhost:7229/api/Cart')
      .then((response) => {
        setCartItems(response.data.$values);
      })
      .catch((error) => console.error('Error fetching cart data:', error));
  }, []);

  return (
    <div className="container my-4">
      <h2 className="mb-3">Cart Items</h2>
      <div className="list-group">
        {cartItems.map((item) => (
          <div className="list-group-item" key={item.id}>
            <h5>Item ID: {item.id}</h5>
            <p><strong>Price:</strong> ${item.price}</p>
            <p><strong>Total Price:</strong> ${item.totalPrice}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Status:</strong> {item.status}</p>
            <p><strong>Created Date:</strong> {new Date(item.createdDate).toLocaleDateString()}</p>
            <p><strong>Modified Date:</strong> {new Date(item.modifiedDate).toLocaleDateString()}</p>
            <button
              className="btn btn-primary mt-2"
              onClick={() => navigate(`/cartfr/${item.id}`)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartFr;
