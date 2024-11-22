import React, { useState } from "react";
import { Modal, Form, Button, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const CreateConsignment = ({
  show,
  onHide,
  onConsignmentCreated,
  showAlert,
}) => {
  const [createForm, setCreateForm] = useState({
    name: "",
    yearOfBirth: 2022,
    gender: "male",
    origin: "",
    variety: "",
    character: "",
    size: "",
    amountFood: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setErrorMessage(null);

    if (createForm.size <= 0 || createForm.amountFood <= 0) {
      setErrorMessage("Size and Amount of Food must be positive numbers.");
      setSubmitLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("accountId", userData.userId);
      formData.append("koiCode", `K${Date.now()}`);
      formData.append("name", createForm.name);
      formData.append("yearOfBirth", createForm.yearOfBirth);
      formData.append("gender", createForm.gender);
      formData.append("origin", createForm.origin);
      formData.append("variety", createForm.variety);
      formData.append("character", createForm.character);
      formData.append("size", createForm.size);
      formData.append("amountFood", createForm.amountFood);
      formData.append("status", "Pending");
      if (selectedFile) {
        formData.append("img", selectedFile);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const response = await axios.post(
        "https://localhost:7229/api/Consignments",
        formData,
        config
      );

      if (response.data) {
        showAlert(
          "Consignment created successfully! Waiting for admin approval."
        );
        onConsignmentCreated();
        onHide();
      }
    } catch (error) {
      console.error("Error creating consignment:", error);
      showAlert("Failed to create consignment", "danger");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Consignment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        <Form onSubmit={handleCreateSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={createForm.name}
              onChange={(e) =>
                setCreateForm({ ...createForm, name: e.target.value })
              }
              required
              placeholder="Enter koi name"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Year of Birth</Form.Label>
            <Form.Control
              type="number"
              value={createForm.yearOfBirth}
              onChange={(e) =>
                setCreateForm({ ...createForm, yearOfBirth: e.target.value })
              }
              required
              min="1900"
              max={new Date().getFullYear()}
              placeholder="Enter year of birth"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              value={createForm.gender}
              onChange={(e) =>
                setCreateForm({ ...createForm, gender: e.target.value })
              }
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Form.Select>
          </Form.Group>

          {/* Origin Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Origin</Form.Label>
            <Form.Select
              value={createForm.origin}
              onChange={(e) =>
                setCreateForm({ ...createForm, origin: e.target.value })
              }
              required
            >
              <option value="">Select an origin</option>
              <option value="vietnam">Vietnam</option>
              <option value="japan">Japan</option>
              <option value="thailand">Thailand</option>
              <option value="china">China</option>
              <option value="southafrica">South Africa</option>
              <option value="india">India</option>
            </Form.Select>
          </Form.Group>

          {/* Variety Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Variety</Form.Label>
            <Form.Select
              value={createForm.variety}
              onChange={(e) =>
                setCreateForm({ ...createForm, variety: e.target.value })
              }
              required
            >
              <option value="">Select a variety</option>
              <option value="Kohaku">Kohaku</option>
              <option value="Showa Sanke">Showa Sanke</option>
              <option value="Utsuri">Utsuri</option>
              <option value="Asagi">Asagi</option>
              <option value="Shusui">Shusui</option>
              <option value="Ginrin">Ginrin</option>
              <option value="Ogon">Ogon</option>
              <option value="Tancho">Tancho</option>
            </Form.Select>
          </Form.Group>

          {/* Character Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Character</Form.Label>
            <Form.Select
              value={createForm.character}
              onChange={(e) =>
                setCreateForm({ ...createForm, character: e.target.value })
              }
              required
            >
              <option value="">Select a character</option>
              <option value="Friendly">Friendly</option>
              <option value="Curious">Curious</option>
              <option value="Shy">Shy</option>
              <option value="Aggressive">Aggressive</option>
              <option value="Calm">Calm</option>
              <option value="Playful">Playful</option>
              <option value="Adaptable">Adaptable</option>
              <option value="Showy">Showy</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Size (cm)</Form.Label>
            <Form.Control
              type="number"
              value={createForm.size}
              onChange={(e) =>
                setCreateForm({ ...createForm, size: e.target.value })
              }
              required
              min="1"
              placeholder="Enter koi size in cm"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Amount of Food (gram)</Form.Label>
            <Form.Control
              type="number"
              value={createForm.amountFood}
              onChange={(e) =>
                setCreateForm({ ...createForm, amountFood: e.target.value })
              }
              required
              min="1"
              placeholder="Enter amount of food in kg"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Koi Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              accept="image/*"
              required
            />
            <Form.Text className="text-muted">
              Please upload a clear image of your koi.
            </Form.Text>
          </Form.Group>

          <div className="d-grid">
            <Button type="submit" variant="primary" disabled={submitLoading}>
              {submitLoading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Creating...
                </>
              ) : (
                "Create Consignment"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateConsignment;
