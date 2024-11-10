import React from "react";
import { Container, Row, Col, ListGroup, Button } from "react-bootstrap";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer style={{ backgroundColor: "#f8f9fa", padding: "40px 0" }}>
      <Container>
        <Row>
          {/* Phần thông tin liên hệ */}
          <Col md={4} className="mb-4">
            <h5>About Koi Farm Shop</h5>
            <p>
              Koi Farm Shop là cửa hàng chuyên cung cấp các giống cá Koi chất
              lượng cao, uy tín với đầy đủ dịch vụ chăm sóc và bảo hành.
            </p>
            <p>
              Địa chỉ: 123 Đường Số 1, Phường 2, Quận 3, TP. HCM <br />
              Điện thoại: (028) 1234 5678
            </p>
          </Col>

          {/* Phần liên kết nhanh */}
          <Col md={4} className="mb-4">
            <h5>Quick Links</h5>
            <ListGroup variant="flush">
              <ListGroup.Item action href="#about" className="p-0 border-0">
                About Us
              </ListGroup.Item>
              <ListGroup.Item action href="#shop" className="p-0 border-0">
                Shop
              </ListGroup.Item>
              <ListGroup.Item action href="#blog" className="p-0 border-0">
                Blog
              </ListGroup.Item>
              <ListGroup.Item action href="#contact" className="p-0 border-0">
                Contact
              </ListGroup.Item>
              <ListGroup.Item action href="#faq" className="p-0 border-0">
                FAQs
              </ListGroup.Item>
            </ListGroup>
          </Col>

          {/* Phần theo dõi mạng xã hội và đăng ký nhận tin */}
          <Col md={4} className="mb-4">
            <h5>Follow Us</h5>
            <div className="d-flex gap-3 mb-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram size={24} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter size={24} />
              </a>
              <a href="mailto:info@koifarmshop.com">
                <Mail size={24} />
              </a>
            </div>
            <h5>Newsletter</h5>
            <p>Đăng ký nhận tin mới nhất từ cửa hàng của chúng tôi.</p>
            <div className="d-flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-control me-2"
                style={{ maxWidth: "250px" }}
              />
              <Button variant="primary">Subscribe</Button>
            </div>
          </Col>
        </Row>

        {/* Phần bản quyền */}
        <Row className="mt-4">
          <Col className="text-center">
            <small className="text-muted">
              &copy; {new Date().getFullYear()} Koi Farm Shop. All rights
              reserved.
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
