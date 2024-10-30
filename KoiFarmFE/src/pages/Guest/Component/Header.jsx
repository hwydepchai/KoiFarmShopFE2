/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import "./component.css";
import axios from "axios";

const Header = () => {
  const [koiFishTypes, setKoiFishTypes] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://localhost:7229/api/KoiFish")
      .then((response) => {
        const types = Array.from(new Set(response.data.map((koi) => koi.type)));
        setKoiFishTypes(types);
      })
      .catch((error) => {
        console.error("Error fetching Koi Fish data:", error);
      });

    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.fullname) {
      console.log("Stored user data:", storedUser);
      setUser(storedUser);
    } else {
      console.log("No valid user data in localStorage.");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
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
              All Koi Fish
            </NavDropdown.Item>
            <NavDropdown.Divider />
            {koiFishTypes.map((type, index) => (
              <NavDropdown.Item key={index} as={Link} to={`/koifish/${type}`}>
                {type}
              </NavDropdown.Item>
            ))}
          </NavDropdown>

          <Nav.Link as={Link} to="/consign" className="text-white">
            Consign
          </Nav.Link>
          <Nav.Link as={Link} to="/order" className="text-white">
            Order
          </Nav.Link>
          <Nav.Link as={Link} to="/cart" className="text-white">
            Cart
          </Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          {user ? (
            <NavDropdown
              title={<span className="text-white btn">{user.fullname}</span>}
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
