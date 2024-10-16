/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import 'bootstrap/dist/css/bootstrap.min.css';

function CartPage() {
    const [cartList, setCartList] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []); // Empty array ensures it runs only once after the initial render

    const fetchCart = async () => {
        try {
            const response = await axios.get("https://localhost:7229/api/Cart");
            const cartData = response.data;
            setCartList(cartData); // Store the cart data in state
        } catch (error) {
            console.error("Error fetching cart data: ", error);
        }
    };

    return (
        <div className="container mt-5">
            <CartTable carts={cartList} title="Cart Items" />
        </div>
    );
}

const CartTable = ({ carts, title }) => {
    return (
        <div className="card">
            <div className="card-header">
                <h2 className="card-title">{title}</h2>
            </div>
            <div className="card-body">
                <table className="table table-striped table-bordered">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Order ID</th>
                            <th>Price</th>
                            <th>Total Price</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Created Date</th>
                            <th>Modified Date</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.map((cart) => (
                            <tr key={cart.id}>
                                <td>{cart.id}</td>
                                <td>{cart.orderId}</td>
                                <td>{cart.price}</td>
                                <td>{cart.totalPrice}</td>
                                <td>{cart.quantity}</td>
                                <td>{cart.status}</td>
                                <td>{new Date(cart.createdDate).toLocaleString()}</td>
                                <td>{new Date(cart.modifiedDate).toLocaleString()}</td>
                                <td>
                                    <button>Purchase</button>
                                </td>
                                <td>Detail</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

CartTable.propTypes = {
    carts: PropTypes.array.isRequired, // carts should be an array
    title: PropTypes.string.isRequired, // title should be a string
};

export default CartPage;
