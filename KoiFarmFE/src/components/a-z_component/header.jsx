/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
