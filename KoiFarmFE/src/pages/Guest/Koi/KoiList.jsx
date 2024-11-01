/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Row, Col, Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const KoiList = () => {
  const [koiFish, setKoiFish] = useState([]);
  const [filteredKoi, setFilteredKoi] = useState([]);
  const [categories, setCategories] = useState({});
  const [filters, setFilters] = useState({
    species: "",
    gender: "",
    category: "",
    minSize: "",
    maxSize: "",
    minAge: "",
    maxAge: "",
    type: "",
    minPrice: "",
    maxPrice: "",
    minAmountFood: "",
    maxAmountFood: "",
  });

  useEffect(() => {
    // Fetch koi fish data
    axios
      .get("https://localhost:7229/api/KoiFish")
      .then((response) => {
        // Accessing the values directly from the response
        setKoiFish(response.data.$values);
        setFilteredKoi(response.data.$values);
      })
      .catch((error) => {
        console.error("Error fetching Koi Fish data:", error);
      });

    // Fetch category data
    axios
      .get("https://localhost:7229/api/Category")
      .then((response) => {
        const categoryMap = {};
        response.data.forEach((category) => {
          categoryMap[category.id] = category.category1;
        });
        setCategories(categoryMap);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Filter koi fish based on user inputs
  const applyFilters = () => {
    const filtered = koiFish.filter((koi) => {
      return (
        (!filters.species || koi.species.includes(filters.species)) &&
        (!filters.minSize || koi.size >= parseFloat(filters.minSize)) &&
        (!filters.maxSize || koi.size <= parseFloat(filters.maxSize)) &&
        (!filters.minAge || koi.age >= parseInt(filters.minAge)) &&
        (!filters.maxAge || koi.age <= parseInt(filters.maxAge)) &&
        (!filters.type || koi.type.includes(filters.type)) &&
        (!filters.minAmountFood || koi.amountFood >= parseFloat(filters.minAmountFood)) &&
        (!filters.maxAmountFood || koi.amountFood <= parseFloat(filters.maxAmountFood)) &&
        (!filters.minPrice || koi.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || koi.price <= parseFloat(filters.maxPrice)) &&
        (!filters.gender || koi.gender === filters.gender) &&
        (!filters.category || koi.categoryId === parseInt(filters.category))
      );
    });
    setFilteredKoi(filtered);
  };

  // Update filter criteria
  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    applyFilters();
  }, [filters]);

  return (
    <Container fluid>
      <h2 className="my-4">Koi Fish List</h2>
      <Row>
        {/* Sidebar with Filters */}
        <Col md={3}>
          <Form>
            {/* Gender Filter */}
            <Form.Group controlId="filter-gender">
              <Form.Label>Gender</Form.Label>
              <Row>
                <Col>
                  <Form.Check
                    type="radio"
                    name="gender"
                    label="All"
                    value=""
                    onChange={handleFilterChange}
                    checked={filters.gender === ""}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="radio"
                    name="gender"
                    label="Male"
                    value="Male"
                    onChange={handleFilterChange}
                    checked={filters.gender === "Male"}
                  />
                </Col>
                <Col>
                  <Form.Check
                    type="radio"
                    name="gender"
                    label="Female"
                    value="Female"
                    onChange={handleFilterChange}
                    checked={filters.gender === "Female"}
                  />
                </Col>
              </Row>
            </Form.Group>

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

            {/* Min-Max Filters */}
            {[
              { label: "Size (cm)", minName: "minSize", maxName: "maxSize" },
              { label: "Age (years)", minName: "minAge", maxName: "maxAge" },
              { label: "Price (VND)", minName: "minPrice", maxName: "maxPrice" },
              { label: "Food (kg)", minName: "minAmountFood", maxName: "maxAmountFood" },
            ].map(({ label, minName, maxName }) => (
              <Form.Group controlId={`filter-${minName}`} key={minName}>
                <Form.Label>{label}</Form.Label>
                <Row>
                  <Col>
                    <Form.Control
                      type="number"
                      name={minName}
                      value={filters[minName]}
                      onChange={handleFilterChange}
                      placeholder="Min"
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="number"
                      name={maxName}
                      value={filters[maxName]}
                      onChange={handleFilterChange}
                      placeholder="Max"
                    />
                  </Col>
                </Row>
              </Form.Group>
            ))}
          </Form>
        </Col>

        {/* Main Content */}
        <Col md={9}>
          {/* Species Search */}
          <Form.Group controlId="filter-species" className="mb-4">
            <Form.Control
              type="text"
              name="species"
              value={filters.species}
              onChange={handleFilterChange}
              placeholder="Search by Species"
            />
          </Form.Group>

          {/* Koi Fish Cards */}
          <Row>
            {filteredKoi.map((koi) => (
              <Col md={4} key={koi.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{koi.species}</Card.Title>
                    <Card.Text>Type: {koi.type}</Card.Text>
                    <Card.Text>Age: {koi.age} years</Card.Text>
                    <Card.Text>Size: {koi.size} cm</Card.Text>
                    <Card.Text>Price: {koi.price} VND</Card.Text>
                    <Card.Text>
                      Category: {categories[koi.categoryId] || "Unknown"}
                    </Card.Text>
                    <Link to={`/koifish/${koi.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default KoiList;
