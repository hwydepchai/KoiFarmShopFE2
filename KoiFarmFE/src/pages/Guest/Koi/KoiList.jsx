/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Form, Row, Col, Container } from "react-bootstrap";
import { Link } from "react-router-dom";

const KoiList = () => {
  const [koiFish, setKoiFish] = useState([]);
  const [filteredKoi, setFilteredKoi] = useState([]);
  const [filters, setFilters] = useState({
    species: "",
    size: "",
    age: "",
    type: "",
    amountFood: ""
  });

  useEffect(() => {
    axios
      .get("https://localhost:7229/api/KoiFish")
      .then((response) => {
        setKoiFish(response.data);
        setFilteredKoi(response.data);
      })
      .catch((error) => {
        console.error("Error fetching Koi Fish data:", error);
      });
  }, []);

  // Filter koi fish based on user inputs
  const applyFilters = () => {
    const filtered = koiFish.filter((koi) => {
      return (
        (!filters.species || koi.species.includes(filters.species)) &&
        (!filters.size || koi.size <= parseFloat(filters.size)) &&
        (!filters.age || koi.age <= parseInt(filters.age)) &&
        (!filters.type || koi.type.includes(filters.type)) &&
        (!filters.amountFood || koi.amountFood <= parseFloat(filters.amountFood))
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
    <Container>
      <h2 className="my-4">Koi Fish List</h2>
      {/* Filter Section */}
      <Form className="mb-4">
        <Row>
          {["species", "size", "age", "type", "amountFood"].map((filter) => (
            <Col key={filter} md={2}>
              <Form.Group controlId={`filter-${filter}`}>
                <Form.Label>{filter.charAt(0).toUpperCase() + filter.slice(1)}</Form.Label>
                <Form.Control
                  type="text"
                  name={filter}
                  value={filters[filter]}
                  onChange={handleFilterChange}
                  placeholder={`Enter ${filter}`}
                />
              </Form.Group>
            </Col>
          ))}
        </Row>
      </Form>

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
                <Link to={`/koifish/${koi.id}`} className="btn btn-primary">
                  View Details
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KoiList;
