/* eslint-disable no-unused-vars */
import React from "react";
import { Container, Row, Col, Navbar, Nav, Card } from "react-bootstrap";
import { Link, Route, Routes } from "react-router-dom";
import DashboardContent from "./dashboard";
import KoiFishList from "./KoiManage/koifish";
import KoiFishDetails from "./KoiManage/koidetails";
import OrderList from "./OrderManage/order";
import Settings from "./setting";
import CartList from "./CartManage/cart";
import AccountList from "./account";

const Dashboard = () => {
  return (
    <div>
      <Container fluid>
        <Row className="mt-4 justify-content-between">
          <Col md={2}>

            {/* Sidebar */}
            <Card>
              <Card.Body>
                <h5>Sidebar</h5>
                <Nav className="flex-column">
                  <Nav.Link as={Link} to="/dashboard">
                    Dashboard
                  </Nav.Link>
                  <Nav.Link as={Link} to="/dashboard/account">
                    Account
                  </Nav.Link>
                  <Nav.Link as={Link} to="/dashboard/koifish">
                    Koi Fish
                  </Nav.Link>
                  <Nav.Link as={Link} to="/dashboard/order">
                    Order
                  </Nav.Link>
                  <Nav.Link as={Link} to="/dashboard/cart">
                    Cart
                  </Nav.Link>
                  <Nav.Link as={Link} to="/dashboard/settings">
                    Settings
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          <Col md={10}>
            {/* Dynamic content */}
            <Card>
              <Card.Body>
                <Routes>
                  <Route
                    path="/"
                    element={<DashboardContent />}
                  />
                  <Route path="/account" element={<AccountList />} />
                  <Route path="/koifish/*" element={<KoiFishList />} />
                  <Route path="/koi/:id" element={<KoiFishDetails />} />
                  <Route path="/order" element={<OrderList />} />
                  <Route path="/cart" element={<CartList />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
