/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function CartDetails() {
  const { id } = useParams(); // Get the cart detail ID from the URL parameters
  const [cartDetail, setCartDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartDetail();
  }, []);

  const fetchCartDetail = async () => {
    try {
      const response = await axios.get(
        `https://localhost:7229/api/CartDetail/${id}`
      );
      const cartDetailData = response.data;
      setCartDetail(cartDetailData); // Store the cart detail data in state
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!cartDetail) return <div>No details found</div>;

  return (
    <div className="container mt-5">
      <h2>Cart Detail for ID: {cartDetail.id}</h2>
      <table className="table table-striped table-bordered">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{cartDetail.id}</td>
          </tr>
          <tr>
            <th>Koi ID</th>
            <td>{cartDetail.koiId}</td>
          </tr>
          <tr>
            <th>Cart ID</th>
            <td>{cartDetail.cartId}</td>
          </tr>
          <tr>
            <th>Feedback ID</th>
            <td>{cartDetail.feedbackId || "N/A"}</td>
          </tr>
          <tr>
            <th>Price</th>
            <td>{cartDetail.price}</td>
          </tr>
          <tr>
            <th>Status</th>
            <td>{cartDetail.status}</td>
          </tr>
          <tr>
            <th>Created Date</th>
            <td>{new Date(cartDetail.createdDate).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Modified Date</th>
            <td>{new Date(cartDetail.modifiedDate).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Deleted Date</th>
            <td>
              {cartDetail.deletedDate
                ? new Date(cartDetail.deletedDate).toLocaleString()
                : "Not Deleted"}
            </td>
          </tr>
          <tr>
            <th>Is Deleted</th>
            <td>{cartDetail.isDeleted ? "Yes" : "No"}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default CartDetails;
