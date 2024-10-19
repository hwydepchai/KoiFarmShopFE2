/* eslint-disable no-unused-vars */
import React from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./component.css";

const Header = () => {
  return (
    <Navbar className="nav-bar d-flex justify-content-between">
      <Navbar.Brand href="#home" className="brand">
        <h3 className="">Koi Farm Shop</h3>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="d-flex">
          <Nav.Link as={Link} to="/category">
            Category
          </Nav.Link>
          <Nav.Link as={Link} to="/koifish">
            Koi Fish
          </Nav.Link>
          <Nav.Link as={Link} to="/order">
            Order
          </Nav.Link>
          <Nav.Link as={Link} to="/cart">
            Cart
          </Nav.Link>
          <Nav.Link as={Link} to="/user">
            User Settings
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
