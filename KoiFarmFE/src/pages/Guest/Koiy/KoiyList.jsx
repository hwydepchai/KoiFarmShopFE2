/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const KoiyList = () => {
  const [koiFishList, setKoiFishList] = useState([]);
  const [filteredKoi, setFilteredKoi] = useState([]);
  const [categories, setCategories] = useState({});
  const [images, setImages] = useState([]); // State to store images
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    minQuantity: "",
    maxQuantity: "",
    status: "",
  });

  useEffect(() => {
    const fetchKoiFishData = async () => {
      try {
        // Fetch koi fish data
        const koiResponse = await axios.get("https://localhost:7229/api/KoiFishy");
        const koiFishList = koiResponse.data.$values;

        // Fetch categories
        const categoryResponse = await axios.get("https://localhost:7229/api/Category");
        const categoryMap = {};
        categoryResponse.data.$values.forEach((category) => {
          categoryMap[category.id] = category.category1;
        });
        setCategories(categoryMap);

        // Fetch images
        const imageResponse = await axios.get("https://localhost:7229/api/Image");
        setImages(imageResponse.data.$values); // Store images in state

        setKoiFishList(koiFishList);
        setFilteredKoi(koiFishList); // Initialize filtered list
      } catch (error) {
        console.error("Error fetching koi fish, category, or image data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchKoiFishData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, koiFishList]);

  const applyFilters = () => {
    const filtered = koiFishList.filter((koi) => {
      return (
        koi.status === "Active" && // Only active status
        koi.isDeleted === false && // Only non-deleted items
        (!filters.category || koi.categoryId === parseInt(filters.category)) &&
        (!filters.minPrice || koi.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || koi.price <= parseFloat(filters.maxPrice)) &&
        (!filters.minQuantity || koi.quantity >= parseInt(filters.minQuantity)) &&
        (!filters.maxQuantity || koi.quantity <= parseInt(filters.maxQuantity)) &&
        (!filters.status || koi.status.toLowerCase().includes(filters.status.toLowerCase()))
      );
    });
    setFilteredKoi(filtered);
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getKoiImages = (koiId) => {
    // Filter the images to match the koiFishyId
    return images.filter((image) => image.koiFishyId === koiId);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <Container fluid>
      <h2 className="my-4">Koi Fish List</h2>
      <Row>
        {/* Sidebar with Filters */}
        <Col md={3}>
          <Form>
            {/* Category Filter */}
            <Form.Group controlId="filter-category">
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                {Object.entries(categories).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Price Filters */}
            <Form.Group controlId="filter-price">
              <Form.Label>Price</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min Price"
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max Price"
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Quantity Filters */}
            <Form.Group controlId="filter-quantity">
              <Form.Label>Quantity</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    name="minQuantity"
                    value={filters.minQuantity}
                    onChange={handleFilterChange}
                    placeholder="Min Quantity"
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="maxQuantity"
                    value={filters.maxQuantity}
                    onChange={handleFilterChange}
                    placeholder="Max Quantity"
                  />
                </Col>
              </Row>
            </Form.Group>

            {/* Status Filter */}
            <Form.Group controlId="filter-status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                placeholder="Search by Status"
              />
            </Form.Group>
          </Form>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          <Row>
            {filteredKoi.map((koi) => {
              const koiImages = getKoiImages(koi.id); // Get koi images for this koi
              return (
                <Col md={4} key={koi.id} className="mb-4">
                  <Card>
                    {/* Display the first image (or a placeholder if no image available) */}
                    <Card.Img
                      variant="top"
                      src={koiImages.length > 0 ? koiImages[0].urlPath : "https://via.placeholder.com/150"}
                      alt={`Koi ID: ${koi.id}`}
                      style={{ height: "150px", objectFit: "cover" }}
                    />
                    <Card.Body>
                      <Card.Title>Koi ID: {koi.id}</Card.Title>
                      <Card.Text>Price: {koi.price} VND</Card.Text>
                      <Card.Text>Quantity: {koi.quantity}</Card.Text>
                      <Card.Text>Status: {koi.status}</Card.Text>
                      <Card.Text>
                        Category: {categories[koi.categoryId] || "Unknown"}
                      </Card.Text>
                      <Link to={`/koifishy/${koi.id}`} className="btn btn-primary">
                        View Details
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default KoiyList;
