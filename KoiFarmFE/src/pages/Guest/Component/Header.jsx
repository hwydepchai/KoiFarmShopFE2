/* eslint-disable no-unused-vars */
import React from "react";
import { Navbar, Nav } from "react-bootstrap";

const Header = () => {
  return (
    <Navbar className="nav d-flex justify-content-between">
      <Navbar.Brand href="#home">
        <h3 className="text-light">Koi Farm Shop</h3>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#home">
            <p>Home</p>
          </Nav.Link>
          <Nav.Link href="#koi-fish">
            <p>Koi Fish</p>
          </Nav.Link>
          <Nav.Link href="#consign">
            <p>Consign</p>
          </Nav.Link>
          <Nav.Link href="#sell">
            <p>Sell</p>
          </Nav.Link>
          <Nav.Link href="#user-center">
            <p>User Center</p>
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
