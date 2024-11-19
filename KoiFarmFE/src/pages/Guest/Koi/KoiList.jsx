/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./KoiList.css";

const KoiList = () => {
  const [koiFish, setKoiFish] = useState([]);
  const [filteredKoi, setFilteredKoi] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [filters, setFilters] = useState({
    species: "",
    gender: "",
    category: "",
    type: "",
    minPrice: "",
    maxPrice: "",
  });

  // Fetch initial data for koi fish, categories, and images
  useEffect(() => {
    axios
      .get("https://localhost:7229/api/Image")
      .then((response) => {
        setImages(response.data.$values);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });

    axios
      .get("https://localhost:7229/api/KoiFish")
      .then((response) => {
        const koiData = response.data.$values.filter((koi) => !koi.isDeleted);
        setKoiFish(koiData);
      })
      .catch((error) => {
        console.error("Error fetching koi fish data:", error);
      });

    axios
      .get("https://localhost:7229/api/Category")
      .then((response) => {
        setCategories(response.data.$values);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Apply filters based on state
  useEffect(() => {
    const filtered = koiFish.filter((koi) => {
      const matchNameOrOrigin =
        !filters.species ||
        koi.name.toLowerCase().includes(filters.species.toLowerCase()) ||
        koi.origin.toLowerCase().includes(filters.species.toLowerCase());
      const matchGender = !filters.gender || koi.gender === filters.gender;
      const matchCategory =
        !filters.category || koi.categoryId === parseInt(filters.category);
      const matchType = !filters.type || koi.type === filters.type;
      const matchPrice =
        (!filters.minPrice || koi.price >= parseFloat(filters.minPrice)) &&
        (!filters.maxPrice || koi.price <= parseFloat(filters.maxPrice));

      return (
        matchNameOrOrigin &&
        matchGender &&
        matchCategory &&
        matchType &&
        matchPrice
      );
    });

    setFilteredKoi(filtered);
  }, [filters, koiFish]);

  // Handle changes in filter inputs
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  return (
    <Container fluid>
      <h2 className="my-4">Koi Fish List</h2>
      <Row>
        {/* Sidebar with Filters */}
        <Col md={2}>
          <Form>
            <h3>Filter</h3>
            {/* Gender Filter */}
            <Form.Group controlId="filter-gender">
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
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category1}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Type Filter */}
            <Form.Group controlId="filter-type">
              <Form.Label>Type</Form.Label>
              <Form.Control
                as="select"
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <option value="">All Types</option>
                <option value="Native">Native</option>
                <option value="F1">F1</option>
                <option value="Imported">Imported</option>
              </Form.Control>
            </Form.Group>

            {/* Price Filter */}
            <Form.Group controlId="filter-price">
              <Form.Label>Price (VND)</Form.Label>
              <Row>
                <Col>
                  <Form.Control
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                  />
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Col>

        {/* Main Content */}
        <Col md={10}>
          {/* Species Search */}
          <Form.Group controlId="filter-species" className="mb-4">
            <Form.Control
              type="text"
              name="species"
              value={filters.species}
              onChange={handleFilterChange}
              placeholder="Search by Name or Origin"
            />
          </Form.Group>

          {/* Koi Fish Cards */}
          <Row>
            {filteredKoi.map((koi) => {
              const koiImage = images.find((image) => image.koiId === koi.id);
              return (
                <Col md={4} key={koi.id} className="mb-4">
                  <Card>
                    {koiImage ? (
                      <Card.Img
                        variant="top"
                        src={koiImage.urlPath}
                        alt={`${koi.species} Image`}
                        className="koiList-card"
                      />
                    ) : (
                      <Card.Img alt="img" className="koiList-card" />
                    )}
                    <Card.Body>
                      <Card.Title>{koi.name}</Card.Title>
                      <Card.Text>Price: {koi.price} VND</Card.Text>
                      <Card.Text>
                        Category:{" "}
                        {categories.find((cat) => cat.id === koi.categoryId)
                          ?.category1 || "Unknown"}
                      </Card.Text>
                      <Card.Text>Type: {koi.type}</Card.Text>
                      <Card.Text>Origin: {koi.origin}</Card.Text>
                      <Link
                        to={`/koifish/${koi.id}`}
                        className="btn btn-primary"
                      >
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

export default KoiList;
