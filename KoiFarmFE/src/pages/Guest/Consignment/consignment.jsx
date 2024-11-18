import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Button,
  Table,
  Badge,
  Spinner,
  Alert,
} from "react-bootstrap";
import axios from "axios";
import { Plus, Eye, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DetailsConsign from "./DetailsConsign";
import CreateConsignment from "./CreateConsignment";

const UserConsignment = () => {
  const navigate = useNavigate();
  const [consignments, setConsignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedConsignment, setSelectedConsignment] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token || !userData) {
      navigate("/login");
      return;
    }
    fetchUserConsignments();
  }, []);

  // Hiển thị thông báo
  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 3000);
  };

  // Lấy danh sách consignments của người dùng
  const fetchUserConsignments = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const response = await axios.get(
        `https://localhost:7229/api/Consignments`,
        config
      );

      if (response.data && response.data.$values) {
        const userConsignments = response.data.$values.filter(
          (cons) => cons.accountId === userData.userId
        );

        // Bao gồm trạng thái Pending, Inactive và Active
        const filteredConsignments = userConsignments.filter(
          (consignment) =>
            consignment.status === "Pending" ||
            consignment.status === "Inactive" ||
            consignment.status === "Active"
        );

        setConsignments(filteredConsignments);
      }
    } catch (error) {
      console.error("Error fetching consignments:", error);
      showAlert("Error fetching consignments", "danger");
    } finally {
      setLoading(false);
    }
  };

  // Hàm thêm consignment vào cart
  const addToCart = async (consignment) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const userId = userData?.userId;

      if (!userId) {
        alert("You haven't logged in!");
        navigate("/login");
        return;
      }

      // Lấy thông tin cart hoặc tạo cart mới
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const cartRes = await axios.get(
        "https://localhost:7229/api/Cart",
        config
      );
      let userCart = cartRes.data.$values.find(
        (cart) => cart.accountId === userId && !cart.isDeleted
      );

      if (!userCart) {
        // Tạo cart mới nếu chưa tồn tại
        const newCartRes = await axios.post(
          "https://localhost:7229/api/Cart",
          {
            accountId: userId,
            quantity: 0,
            price: 0,
          },
          config
        );
        userCart = newCartRes.data;
      }

      // Tạo CartItem mới
      const cartItem = {
        cartId: userCart.id,
        koiFishId: null,
        koiFishyId: null,
        consignmentId: consignment.id,
        price: consignment.price,
      };

      await axios.post("https://localhost:7229/api/CartItem", cartItem, config);

      // Hiển thị thông báo và làm mới danh sách
      showAlert("Consignment added to cart successfully!");
      fetchUserConsignments(); // Làm mới danh sách sau khi thêm vào cart
    } catch (error) {
      console.error("Error adding to cart:", error);
      showAlert(
        "There was an issue adding this consignment to your cart. Please try again.",
        "danger"
      );
    }
  };

  const handleViewDetails = (consignment) => {
    setSelectedConsignment(consignment);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container fluid className="p-4">
      {alert && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      <Card className="shadow-sm">
        <Card.Header className="bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">My Consignments</h5>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} className="me-2" />
              New Consignment
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>Name</th>
                  <th>Gender</th>
                  <th>Size (cm)</th>
                  <th>Status</th>
                  <th>Created Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {consignments.map((consignment) => (
                  <tr key={consignment.id}>
                    <td>{consignment.name}</td>
                    <td>{consignment.gender}</td>
                    <td>{consignment.size} cm</td>
                    <td>
                      <Badge
                        bg={
                          consignment.status === "Active"
                            ? "success"
                            : consignment.status === "Pending"
                            ? "warning"
                            : "secondary"
                        }
                        className="rounded-pill"
                      >
                        {consignment.status}
                      </Badge>
                    </td>
                    <td>
                      {new Date(consignment.createdDate).toLocaleDateString()}
                    </td>
                    <td className="text-center">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewDetails(consignment)}
                        className="me-2"
                      >
                        <Eye size={16} />
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => addToCart(consignment)}
                        disabled={false}
                      >
                        <ShoppingCart size={16} />
                      </Button>
                    </td>
                  </tr>
                ))}
                {consignments.length === 0 && (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No consignments found
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <CreateConsignment
        show={showCreateModal}
        onHide={() => setShowCreateModal(false)}
        onConsignmentCreated={fetchUserConsignments}
        showAlert={showAlert}
      />
      <DetailsConsign
        consignmentId={selectedConsignment?.id}
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
      />
    </Container>
  );
};

export default UserConsignment;
