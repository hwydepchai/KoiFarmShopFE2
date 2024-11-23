/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Table, Button, Row, Col, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const ProductCard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalKoi, setTotalKoi] = useState(0);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const cartResponse = await axios.get(
        "https://localhost:7229/api/CartItem"
      );
      const items = cartResponse.data.$values.filter((item) => !item.isDeleted);

      const orderResponse = await axios.get("https://localhost:7229/api/Order");
      const orders = orderResponse.data.$values;

      // Map order statuses to cart items
      // const enrichedItems = items.map((item) => {
      //   const relatedOrder = orders.find(
      //     (order) => order.cartId === item.cartId
      //   );
      //   return {
      //     ...item,
      //     status: relatedOrder?.status || "Pending",
      //   };
      // });

      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const relatedOrder = orders.find(
            (order) => order.cartId === item.cartId
          );

          let name = "Unknown Item";
          if (item.koiFishId) {
            const koiResponse = await axios.get(
              `https://localhost:7229/api/KoiFish/${item.koiFishId}`
            );
            name = koiResponse.data.name || "Unknown Koi Fish";
          } else if (item.koiFishyId) {
            const koiFishyResponse = await axios.get(
              `https://localhost:7229/api/KoiFishy/${item.koiFishyId}`
            );
            name = koiFishyResponse.data.name || "Unknown Koi Fishy";
          } else if (item.consignmentId) {
            const consignmentResponse = await axios.get(
              `https://localhost:7229/api/Consignments/${item.consignmentId}`
            );
            name = consignmentResponse.data.name || "Unknown Consignment";
          }

          return {
            ...item,
            status: relatedOrder?.status || "Pending",
            name,
          };
        })
      );

      const pendingItems = enrichedItems.filter(
        (item) => item.status === "Pending"
      );

      setCartItems(pendingItems);

      const totalPrice = pendingItems.reduce(
        (sum, item) => sum + (item.price || 0),
        0
      );
      const totalKoi = pendingItems.length;

      setTotalPrice(totalPrice);
      setTotalKoi(totalKoi);
    } catch (error) {
      console.error("Error fetching cart items or orders:", error);
      setAlertMessage("Failed to load cart items. Please try again.");
    }
  };

  // const removeCartItem = async (id) => {
  //   try {
  //     await axios.delete(`https://localhost:7229/api/CartItem/${id}`);
  //     fetchCartItems();
  //   } catch (error) {
  //     console.error("Error removing cart item:", error);
  //     setAlertMessage("Failed to remove item. Please try again.");
  //   }
  // };

  const handleCheckout = async () => {
    try {
      
      if (totalPrice <= 0) {
        setAlertMessage(
          "Your total is too low to proceed with checkout. Add more items."
        );
        return; 
      }

      const user = JSON.parse(localStorage.getItem("user"));
      const userId = user?.userId;

      if (!userId) {
        setAlertMessage("User not logged in. Please log in to proceed.");
        return;
      }

      if (cartItems.length === 0) {
        setAlertMessage("Your cart is empty. Add items to proceed.");
        return;
      }

      const cartPayload = {
        accountId: userId,
        quantity: cartItems.length,
        price: totalPrice,
      };

      const cartResponse = await axios.post(
        "https://localhost:7229/api/Cart",
        cartPayload
      );
      const newCart = cartResponse.data;

      const cartItemPromises = cartItems.map(async (item) => {
        const payload = {
          cartId: newCart.id,
          koiFishId: item.koiFishId || null,
          koiFishyId: item.koiFishyId || null,
          consignmentId: item.consignmentId || null,
          price: item.price || 0,
        };

        await axios.post("https://localhost:7229/api/CartItem", payload);
      });

      await Promise.all(cartItemPromises);

      const deletePromises = cartItems.map(async (item) => {
        await axios.delete(`https://localhost:7229/api/CartItem/${item.id}`);
      });

      await Promise.all(deletePromises);

      const orderPayload = {
        accountId: userId,
        cartId: newCart.id,
        price: totalPrice,
        status: "Pending",
      };

      await axios.post("https://localhost:7229/api/Order", orderPayload);

      fetchCartItems();

      navigate("/cart", { state: { cartId: newCart.id } });
    } catch (error) {
      console.error("Error during checkout:", error);
      setAlertMessage("Failed to proceed to checkout. Please try again.");
    }
  };

  return (
    <Container className="mt-4">
      <h1>Your Cart</h1>
      {alertMessage && <Alert variant="danger">{alertMessage}</Alert>}

      <Row className="mb-4">
        <Col xs={6}>
          <h5>Total Koi: {totalKoi}</h5>
        </Col>
        <Col xs={6} className="text-end">
          <h5>Total Price: {totalPrice.toLocaleString()} VND</h5>
        </Col>
      </Row>

      <Table bordered hover>
        <thead>
          <tr>
            <th>No</th>
            <th>Name</th>
            <th>Price</th>
            <th>Status</th>
            {/* <th>Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {cartItems.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{(item.price || 0).toLocaleString()} VND</td>
              <td>{item.status}</td>
              {/* <td>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeCartItem(item.id)}
                >
                  Remove
                </Button>
              </td> */}
            </tr>
          ))}
        </tbody>
      </Table>

      <Row className="mt-4">
        <Col className="text-end">
          <Button variant="primary" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductCard;
