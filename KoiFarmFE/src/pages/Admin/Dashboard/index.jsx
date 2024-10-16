/* eslint-disable no-unused-vars */
import React from "react";
import { Container, Row, Col, Navbar, Nav, Card } from "react-bootstrap";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import DashboardContent from "./dashboard";
import KoiFishList from "./koifish";
import OrderList from "./order";
import Settings from "./setting";

const Dashboard = () => {
  return (
    <Router>
      <div>
        {/* Navbar */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="#">Dashboard</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/dashboard">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/account">
                  Account
                </Nav.Link>
                <Nav.Link as={Link} to="/koifish">
                  Koi Fish
                </Nav.Link>
                <Nav.Link as={Link} to="/order">
                  Order
                </Nav.Link>
                <Nav.Link as={Link} to="/category">
                  Category
                </Nav.Link>
                <Nav.Link as={Link} to="/consignments">
                  Consignments
                </Nav.Link>
                <Nav.Link as={Link} to="/feedback">
                  Feedback
                </Nav.Link>
                <Nav.Link as={Link} to="/certificate">
                  Certificate
                </Nav.Link>
                <Nav.Link as={Link} to="/settings">
                  Settings
                </Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Main content */}
        <Container fluid>
          <Row className="mt-4">
            <Col md={3}>
              {/* Sidebar */}
              <Card>
                <Card.Body>
                  <h5>Sidebar</h5>
                  <Nav className="flex-column">
                    <Nav.Link as={Link} to="/dashboard">
                      Dashboard
                    </Nav.Link> 
                    <Nav.Link as={Link} to="/koifish">
                      Koi Fish
                    </Nav.Link>
                    <Nav.Link as={Link} to="/order">
                      Order
                    </Nav.Link>
                    <Nav.Link as={Link} to="/settings">
                      Settings
                    </Nav.Link>
                  </Nav>
                </Card.Body>
              </Card>
            </Col>

            <Col md={9}>
              {/* Dynamic content */}
              <Card>
                <Card.Body>
                  <Routes>
                    <Route path="/dashboard" element={<DashboardContent />} />
                    <Route path="/koifish" element={<KoiFishList />} />
                    <Route path="/order" element={<OrderList />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </Router>
  );
};

export default Dashboard;
