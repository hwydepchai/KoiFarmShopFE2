/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import "./component.css";
import axios from "axios";

const Header = () => {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the userId from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userId = storedUser?.userId;

    // Fetch user data if userId is available
    if (userId) {
      axios
        .get(`https://localhost:7229/api/Accounts/${userId}`)
        .then((response) => {
          const name = response.data.name; // Assuming "name" is the property we need
          setUserName(name);
        })
        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    } else {
      console.log("No valid user data in localStorage.");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUserName(null);
    navigate("/");
  };

  return (
    <Navbar className="nav-bar koi-theme" expand="lg">
      <Navbar.Brand className="brand" as={Link} to="/">
        <h3 className="text-white">Koi Farm Shop</h3>
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <NavDropdown
            title={<span className="text-white">Koi Fish</span>}
            id="koi-fish-dropdown"
            className="dropdown-hover"
          >
            <NavDropdown.Item as={Link} to="/koifish">
              Single
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/koifishy">
              Whole
            </NavDropdown.Item>
          </NavDropdown>

          <Nav.Link as={Link} to="/consignment" className="text-white">
            Consign
          </Nav.Link>
          <Nav.Link as={Link} to="/blog" className="text-white">
            Blog
          </Nav.Link>
          <Nav.Link as={Link} to="/cart" className="text-white">
            Order
          </Nav.Link>
          <Nav.Link as={Link} to="/history" className="text-white">
            History
          </Nav.Link>
          <Nav.Link as={Link} to="/cart" className="text-white">
            Cart
          </Nav.Link>
          <Nav.Link as={Link} to="/feedback" className="text-white">
            Feedback
          </Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          {userName ? (
            <NavDropdown
              title={<span className="text-white btn">{userName}</span>}
              id="user-dropdown"
            >
              <NavDropdown.Item as={Link} to="/user">
                User Center
              </NavDropdown.Item>
              <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
            </NavDropdown>
          ) : (
            <Button as={Link} to="/login" variant="outline-light">
              Login
            </Button>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
